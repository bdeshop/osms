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
  Package,
  User,
  CreditCard,
  Newspaper,
  Radio,
} from "lucide-react";

export const SIDEBAR_CONFIG: SidebarSection[] = [
  // ============================================
  // ADMIN PANEL - For ADMIN users
  // ============================================
  {
    title: "Admin Panel",
    roles: ["ADMIN"],
    items: [
      {
        title: "Dashboard",
        url: "/admin/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Usage Audits",
        url: "/admin/users-packages-messages",
        icon: Shield,
      },
      {
        title: "Packages",
        url: "/admin/packages",
        icon: Package,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Payments",
        url: "/admin/payments",
        icon: CreditCard,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "API Documentation",
        url: "/api-docs",
        icon: FileText,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Contact Us",
        url: "/admin/contact-us",
        icon: Mail,
      },
      {
        title: "Homepage Stats",
        url: "/admin/homepage-stats",
        icon: BarChart3,
      },
      {
        title: "News Updates",
        url: "/admin/news-updates",
        icon: Newspaper,
      },
      {
        title: "Service Channels",
        url: "/admin/service-channels",
        icon: Radio,
      },
      {
        title: "Messaging",
        icon: MessageCircle,
        items: [
          { title: "Send SMS", url: "/admin/messaging/sms", icon: Mail },
          { title: "Campaign", url: "/admin/messaging/campaign", icon: Zap },
          {
            title: "Send Using File",
            url: "/admin/messaging/file",
            icon: Folder,
          },
          {
            title: "Sender ID",
            url: "/admin/messaging/sender-id",
            icon: Settings,
          },
          {
            title: "Non Masking ID",
            url: "/admin/messaging/non-masking",
            icon: Shield,
          },
        ],
      },
    ],
  },

  // ============================================
  // USER PANEL - For USER users
  // ============================================
  {
    title: "User Panel",
    roles: ["USER"],
    items: [
      {
        title: "Dashboard",
        url: "/user/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Packages",
        url: "/user/packages",
        icon: Package,
      },
      {
        title: "Recharge Wallet",
        url: "/user/recharge",
        icon: CreditCard,
      },
      {
        title: "Messages",
        url: "/user/messages",
        icon: MessageCircle,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "API Documentation",
        url: "/api-docs",
        icon: FileText,
      },
    ],
  },
];

// Helper: check if item has children
export const hasChildren = (
  item: SidebarItem,
): item is SidebarItem & { items: SidebarItem[] } =>
  !!item.items && item.items.length > 0;
