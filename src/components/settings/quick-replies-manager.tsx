"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SettingsPanelHead } from "./settings-panel-head";
import {
  InteractiveBuilder,
  blankButtonsPayload,
} from "@/components/interactive/interactive-builder";
import {
  interactivePayloadPreviewText,
  type InteractiveMessagePayload,
} from "@/lib/whatsapp/interactive";
import type { QuickReply, QuickReplyKind } from "@/types";

interface DraftState {
  id?: string;
  title: string;
  kind: QuickReplyKind;
  content_text: string;
  interactive_payload: InteractiveMessagePayload;
}

function emptyDraft(): DraftState {
  return {
    title: "",
    kind: "text",
    content_text: "",
    interactive_payload: blankButtonsPayload(),
  };
}

export function QuickRepliesManager() {
  const t = useTranslations("Settings.quickReplies");
  const [items, setItems] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quick-replies", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setItems((data.quick_replies as QuickReply[]) ?? []);
      else toast.error(t("loadFailed"));
    } catch {
      toast.error(t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => setDraft(emptyDraft());
  const openEdit = (qr: QuickReply) =>
    setDraft({
      id: qr.id,
      title: qr.title,
      kind: qr.kind,
      content_text: qr.content_text ?? "",
      interactive_payload:
        qr.interactive_payload ?? blankButtonsPayload(),
    });

  const save = useCallback(async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast.error(t("nameRequired"));
      return;
    }
    const payload =
      draft.kind === "interactive"
        ? { title: draft.title, kind: "interactive", interactive_payload: draft.interactive_payload }
        : { title: draft.title, kind: "text", content_text: draft.content_text };

    setSaving(true);
    try {
      const res = await fetch(
        draft.id ? `/api/quick-replies/${draft.id}` : "/api/quick-replies",
        {
          method: draft.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? t("saveFailed"));
        return;
      }
      toast.success(draft.id ? t("saveSuccessUpdated") : t("saveSuccessCreated"));
      setDraft(null);
      await load();
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [draft, load, t]);

  const remove = useCallback(
    async (qr: QuickReply) => {
      if (!window.confirm(t("deleteConfirm", { title: qr.title }))) return;
      try {
        const res = await fetch(`/api/quick-replies/${qr.id}`, { method: "DELETE" });
        if (!res.ok) {
          toast.error(t("deleteFailed"));
          return;
        }
        toast.success(t("deleteSuccess"));
        await load();
      } catch {
        toast.error(t("deleteFailed"));
      }
    },
    [load, t],
  );

  return (
    <div>
      <SettingsPanelHead
        title={t("title")}
        description={t("description")}
        action={
          <Button onClick={openCreate} className="h-9 gap-1.5 rounded-xl shadow-xs text-xs font-semibold">
            <Plus className="h-4 w-4" />
            {t("newQuickReply")}
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={t("noQuickRepliesTitle")}
          description={t("noQuickRepliesDesc")}
          action={
            <Button onClick={openCreate} variant="outline" className="h-9 gap-1.5 rounded-xl text-xs font-medium">
              <Plus className="h-3.5 w-3.5" />
              {t("newQuickReply")}
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((qr) => (
            <li
              key={qr.id}
              className="group flex items-start gap-3.5 rounded-xl border border-border/80 bg-card/60 p-3.5 shadow-2xs backdrop-blur-xs transition-all hover:border-border hover:bg-card hover:shadow-xs"
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${
                  qr.kind === "interactive"
                    ? "bg-primary/10 text-primary ring-primary/20"
                    : "bg-muted text-muted-foreground ring-border/60"
                }`}
              >
                {qr.kind === "interactive" ? (
                  <Zap className="h-4 w-4" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-foreground">{qr.title}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-medium ring-1 ring-inset ${
                      qr.kind === "interactive"
                        ? "bg-primary/10 text-primary ring-primary/20"
                        : "bg-muted text-muted-foreground ring-border/60"
                    }`}
                  >
                    {qr.kind === "interactive" ? t("interactiveBadge") : t("textBadge")}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground leading-relaxed">
                  {qr.kind === "interactive" && qr.interactive_payload
                    ? interactivePayloadPreviewText(qr.interactive_payload)
                    : qr.content_text}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 opacity-90 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEdit(qr)}
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">{t("editQuickReply")}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(qr)}
                  className="h-7 w-7 rounded-lg text-status-error/80 hover:bg-status-error/10 hover:text-status-error"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">{t("deleteQuickReply")}</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="rounded-2xl border-border bg-card shadow-lg sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
              {draft?.id ? t("editQuickReply") : t("newQuickReply")}
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="max-h-[70vh] space-y-4 overflow-y-auto py-1 pr-1">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">{t("nameLabel")}</label>
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder={t("namePlaceholder")}
                  className="h-9 rounded-xl border-border/80 bg-muted/50 text-xs text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">{t("typeLabel")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <KindTab
                    active={draft.kind === "text"}
                    label={t("tabText")}
                    onClick={() => setDraft({ ...draft, kind: "text" })}
                  />
                  <KindTab
                    active={draft.kind === "interactive"}
                    label={t("tabInteractive")}
                    onClick={() => setDraft({ ...draft, kind: "interactive" })}
                  />
                </div>
              </div>
              {draft.kind === "text" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">{t("textContentLabel")}</label>
                  <Textarea
                    value={draft.content_text}
                    onChange={(e) => setDraft({ ...draft, content_text: e.target.value })}
                    placeholder={t("textPlaceholder")}
                    className="min-h-32 rounded-xl border-border/80 bg-muted/50 text-xs text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-background"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
                  <InteractiveBuilder
                    value={draft.interactive_payload}
                    onChange={(p) => setDraft({ ...draft, interactive_payload: p })}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDraft(null)}
              disabled={saving}
              className="h-8.5 rounded-xl text-xs"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="h-8.5 gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KindTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex h-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 px-3 text-xs font-semibold text-primary shadow-2xs transition-all"
          : "flex h-9 items-center justify-center rounded-xl border border-border/80 bg-muted/40 px-3 text-xs font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground"
      }
    >
      {label}
    </button>
  );
}
