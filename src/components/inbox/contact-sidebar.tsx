"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { Contact, Deal, ContactNote, Tag } from "@/types";
import {
  Phone,
  Mail,
  Copy,
  Check,
  User,
  Tag as TagIcon,
  DollarSign,
  StickyNote,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { contactHandle } from "@/lib/whatsapp/wa-identity";

interface ContactSidebarProps {
  contact: Contact | null;
}

export function ContactSidebar({ contact }: ContactSidebarProps) {
  const tSidebar = useTranslations("Inbox.sidebar");
  const tThread = useTranslations("Inbox.messageThread");

  const { accountId } = useAuth();
  const [copied, setCopied] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [tags, setTags] = useState<(Tag & { contact_tag_id: string })[]>([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const fetchContactData = useCallback(async () => {
    if (!contact) return;

    const supabase = createClient();

    // Fetch deals, notes, and tags in parallel
    const [dealsRes, notesRes, tagsRes] = await Promise.all([
      supabase
        .from("deals")
        .select("*, stage:pipeline_stages(*)")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_notes")
        .select("*")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_tags")
        .select("id, tag_id, tags(*)")
        .eq("contact_id", contact.id),
    ]);

    if (dealsRes.data) setDeals(dealsRes.data);
    if (notesRes.data) setNotes(notesRes.data);
    if (tagsRes.data) {
      const mapped = tagsRes.data
        .filter((ct: Record<string, unknown>) => ct.tags)
        .map((ct: Record<string, unknown>) => ({
          ...(ct.tags as Tag),
          contact_tag_id: ct.id as string,
        }));
      setTags(mapped);
    }
  }, [contact]);

  // Load on contact change. setContactData/setTags run inside async
  // Supabase callbacks, not synchronously in the effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContactData();
  }, [fetchContactData]);

  const handleCopyPhone = useCallback(async () => {
    // Copies whatever the row displays — a BSUID-only contact has no
    // phone number to copy, but its @username still identifies them.
    const handle = contact ? contactHandle(contact) : '';
    if (!handle) return;
    await navigator.clipboard.writeText(handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Dep is the whole `contact` object (not `contact?.phone`) so the
    // React Compiler's inference agrees with the manual dep list —
    // fixes the `preserve-manual-memoization` lint error.
  }, [contact]);

  const handleAddNote = useCallback(async () => {
    if (!contact || !newNote.trim()) return;
    if (!accountId) return;
    setAddingNote(true);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    const { data, error } = await supabase
      .from("contact_notes")
      .insert({
        contact_id: contact.id,
        account_id: accountId,
        user_id: user?.id,
        note_text: newNote.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setNotes((prev) => [data, ...prev]);
      setNewNote("");
    }
    setAddingNote(false);
  }, [contact, newNote, accountId]);

  if (!contact) {
    return (
      <div className="flex h-full w-72 items-center justify-center border-l border-border bg-card/60 p-6 text-center backdrop-blur-xs">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground ring-1 ring-border/50">
            <User className="h-6 w-6" />
          </div>
          <p className="mt-3 text-xs font-medium text-muted-foreground">{tThread("selectConversation")}</p>
        </div>
      </div>
    );
  }

  const displayName = contact.name || contactHandle(contact);
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-full w-72 flex-col border-l border-border bg-card/95 backdrop-blur-md">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Contact Info Card */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-border/80 bg-muted/30 p-4 shadow-2xs">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary ring-2 ring-primary/20 shadow-xs">
              {contact.avatar_url ? (
                <img
                  src={contact.avatar_url}
                  alt={displayName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <h3 className="mt-3 text-sm font-semibold tracking-tight text-foreground">
              {displayName}
            </h3>
            {contact.company && (
              <span className="mt-1 inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/50">
                {contact.company}
              </span>
            )}
          </div>

          {/* Contact Actions / Channels */}
          <div className="space-y-1.5 rounded-xl border border-border/70 bg-card p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={handleCopyPhone}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted/80"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="flex-1 truncate text-left font-mono">
                {contactHandle(contact)}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground">
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-status-success animate-in zoom-in" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </span>
            </button>

            {contact.email && (
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="truncate">{contact.email}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <TagIcon className="h-3 w-3" />
                {tSidebar("tags")}
              </span>
              {tags.length > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  {tags.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground/80">{tSidebar("noTags")}</p>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag.contact_tag_id}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium shadow-2xs"
                    style={{
                      backgroundColor: `${tag.color}15`,
                      color: tag.color,
                      borderColor: `${tag.color}35`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Active Deals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3 w-3" />
                {tSidebar("deals")}
              </span>
              {deals.length > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  {deals.length}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {deals.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground/80">{tSidebar("noDeals")}</p>
              ) : (
                deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-xl border border-border/80 bg-muted/30 p-3 shadow-2xs transition-all hover:border-border hover:bg-muted/50"
                  >
                    <p className="text-xs font-semibold text-foreground truncate">
                      {deal.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {deal.currency ?? "$"}
                        {deal.value.toLocaleString()}
                      </span>
                      {deal.stage && (
                        <span
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: `${deal.stage.color}15`,
                            color: deal.stage.color,
                            borderColor: `${deal.stage.color}35`,
                          }}
                        >
                          {deal.stage.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <StickyNote className="h-3 w-3" />
                {tSidebar("notes")}
              </span>
              {notes.length > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  {notes.length}
                </span>
              )}
            </div>
            <div className="space-y-2.5">
              <div className="flex flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-2 shadow-2xs focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={tSidebar("addNotePlaceholder")}
                  rows={2}
                  className="w-full resize-none bg-transparent px-1 py-1 text-xs text-foreground placeholder-muted-foreground outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="h-6 gap-1 rounded-md px-2 text-[11px] font-medium"
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || addingNote}
                  >
                    <Plus className="h-3 w-3" />
                    {addingNote ? "..." : tSidebar("addNotePlaceholder").split(" ")[0]}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-border/60 bg-muted/40 p-2.5 shadow-2xs text-xs"
                  >
                    <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                      {note.note_text}
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-muted-foreground">
                      {format(new Date(note.created_at), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
