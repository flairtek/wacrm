import {
  Bell,
  Bot,
  GitBranch,
  LayoutDashboard,
  MessageSquare,
  Radio,
  Settings,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  beta?: boolean;
}

export interface NavGroupConfig {
  groupKey: string;
  items: NavItemConfig[];
}

export const SIDEBAR_NAV_GROUPS: NavGroupConfig[] = [
  {
    groupKey: 'workspace',
    items: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/inbox', labelKey: 'inbox', icon: MessageSquare },
      { href: '/notifications', labelKey: 'notifications', icon: Bell },
    ],
  },
  {
    groupKey: 'sales',
    items: [
      { href: '/contacts', labelKey: 'contacts', icon: Users },
      { href: '/pipelines', labelKey: 'pipelines', icon: GitBranch },
    ],
  },
  {
    groupKey: 'marketing',
    items: [
      { href: '/broadcasts', labelKey: 'broadcasts', icon: Radio },
    ],
  },
  {
    groupKey: 'automation',
    items: [
      { href: '/automations', labelKey: 'automations', icon: Zap },
      { href: '/flows', labelKey: 'flows', icon: Workflow, beta: true },
    ],
  },
  {
    groupKey: 'ai',
    items: [
      { href: '/agents', labelKey: 'aiAgents', icon: Bot },
    ],
  },
  {
    groupKey: 'settings',
    items: [
      { href: '/settings', labelKey: 'settings', icon: Settings },
    ],
  },
];

export function isRouteActive(itemHref: string, currentPathname: string): boolean {
  if (itemHref === '/dashboard') {
    return currentPathname === '/dashboard';
  }
  return currentPathname.startsWith(itemHref);
}
