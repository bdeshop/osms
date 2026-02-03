// @/types/sidebar.types.ts
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url?: string;
   icon?: LucideIcon;   // ✅ FIX HER; // Lucide icon component
  items?: SidebarItem[]; // nested items → makes it a dropdown
  disabled?: boolean;
}

export interface SidebarSection {
  title: string;
  roles: string[];
  items: SidebarItem[];
}