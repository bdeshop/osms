// @/config/sidebar.config.ts
import { SidebarItem, SidebarSection } from "@/types/sidebar.types";
import {
  LayoutDashboard,
  FileText,
  MessageCircle,
  Phone,
  Shield,
  Mail,
  Settings,
  BarChart3,
  Zap,
  Users,
  Code,
  Folder,
  Key,
} from "lucide-react";

export const SIDEBAR_CONFIG: SidebarSection[] = [
  {
    title: "Admin Panel",
    roles: ["ADMIN"],
    items: [
      {
        title: "Dashboard",
        url: "/users/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Messaging",
        icon: MessageCircle,
        items: [
          { title: "Send SMS", url: "/admin/messaging/sms", icon: Mail },
          { title: "Campaign", url: "/admin/messaging/campaign", icon: Zap },
          { title: "Send Using File", url: "/admin/messaging/file", icon: Folder },
          { title: "Sender ID", url: "/admin/messaging/sender-id", icon: Settings },
          { title: "Non Masking ID", url: "/admin/messaging/non-masking", icon: Shield },
        ],
      },
      {
        title: "Phonebook",
        icon: Phone,
        items: [
          { title: "Contacts", url: "/admin/phonebook/contacts", icon: Users },
          { title: "Groups", url: "/admin/phonebook/groups", icon: Users },
        ],
      },
      {
        title: "Templates",
        url: "/admin/templates",
        icon: FileText,
      },
      {
        title: "Blacklist",
        url: "/admin/blacklist",
        icon: Shield,
      },
      {
        title: "Chat Box",
        url: "/admin/chatbox",
        icon: MessageCircle,
      },
      {
        title: "Reports",
        icon: BarChart3,
        items: [
          { title: "Usage", url: "/admin/reports/usage", icon: Zap },
          { title: "Delivery", url: "/admin/reports/delivery", icon: Mail },
          { title: "Errors", url: "/admin/reports/errors", icon: Shield },
        ],
      },
      {
        title: "Developer / API",
        icon: Code,
        items: [
          { title: "API Keys", url: "/admin/api/keys", icon: Key },
          { title: "Webhooks", url: "/admin/api/webhooks", icon: Zap },
          { title: "Documentation", url: "/admin/api/docs", icon: FileText },
        ],
      },
    ],
  }
  ,
  {
    title: "User Panel",
    roles: ["USERS"],
    items: [
      {
        title: "Dashboard",
        url: "/user/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Phonebook",
        icon: Phone,
        items: [
          { title: "Contacts", url: "/user/phonebook/contacts", icon: Users },
          { title: "Groups", url: "/user/phonebook/groups", icon: Users },
        ],
      },
      {
        title: "Reports",
        icon: BarChart3,
        items: [
          { title: "Usage", url: "/user/reports/usage", icon: Zap },
          { title: "Delivery", url: "/user/reports/delivery", icon: Mail },
          { title: "Errors", url: "/user/reports/errors", icon: Shield },
        ],
      },
      {
        title: "Developer / API",
        icon: Code,
        items: [
          { title: "API Keys", url: "/user/api/keys", icon: Key },
          { title: "Webhooks", url: "/user/api/webhooks", icon: Zap },
          { title: "Documentation", url: "/user/api/docs", icon: FileText },
        ],
      },
    ]
  }
];

// Helper: check if item has children
export const hasChildren = (item: SidebarItem): item is SidebarItem & { items: SidebarItem[] } =>
  !!item.items && item.items.length > 0;