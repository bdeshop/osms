/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_CONFIG, hasChildren } from "./sidebar.config";
import { cn } from "@/lib/utils";
import Logo from "@/shared/Logo/Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuIcon, XIcon, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { UserRole } from "@/types/user.role";

interface SidebarProps {
  role: UserRole;
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Toggle dropdown
  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  // Check if dropdown is open
  const isDropdownOpen = (title: string) => openDropdowns.has(title);

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className="hidden lg:flex w-64 min-h-screen border-r bg-background flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {SIDEBAR_CONFIG.filter((section) => section.roles.includes(role)).map((section, i) => (
          <div key={i} className="space-y-1 mt-2">
            {section.items.map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;

              return (
                <div key={item.title} className="relative">
                  {hasChildren(item) ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.title)}
                        className={cn(
                          "flex items-center justify-between w-full gap-3 rounded-md px-3 py-2 text-sm transition",
                          isActive
                            ? "bg-background text-sidebar-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                        {isDropdownOpen(item.title) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>

                      {/* Submenu */}
                      {isDropdownOpen(item.title) && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.items?.map((subItem) => {
                            const subIsActive = pathname === subItem.url;
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={subItem.url}
                                href={subItem.url!}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs transition",
                                  subIsActive
                                    ? "bg-secondary text-sidebar-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <SubIcon className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{subItem.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.url!}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-background text-sidebar-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );

  // Mobile Sidebar (Sheet)
  const MobileSidebar = () => (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="p-2 rounded-md bg-background border shadow-sm"
              aria-label="Open menu"
            >
              {isOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center h-16 border-b px-4">
                <Logo />
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {SIDEBAR_CONFIG.filter((section) => section.roles.includes(role)).map((section, i) => (
                  <div key={i} className="space-y-1 mt-2">
                    {section.items.map((item) => {
                      const isActive = pathname === item.url;
                      const Icon = item.icon;

                      return (
                        <div key={item.title} className="relative">
                          {hasChildren(item) ? (
                            <>
                              <SheetClose asChild>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown(item.title);
                                  }}
                                  className={cn(
                                    "flex items-center justify-between w-full gap-3 rounded-md px-3 py-2 text-sm transition",
                                    isActive
                                      ? "bg-secondary text-sidebar-foreground"
                                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{item.title}</span>
                                  </div>
                                  {isDropdownOpen(item.title) ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </button>
                              </SheetClose>

                              {/* Submenu (mobile) */}
                              {isDropdownOpen(item.title) && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {item.items?.map((subItem) => {
                                    const subIsActive = pathname === subItem.url;
                                    const SubIcon = subItem.icon;
                                    return (
                                      <SheetClose asChild key={subItem.url}>
                                        <Link
                                          href={subItem.url!}
                                          className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-xs transition",
                                            subIsActive
                                              ? "bg-secondary text-sidebar-foreground"
                                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                          )}
                                        >
                                          <SubIcon className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">{subItem.title}</span>
                                        </Link>
                                      </SheetClose>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          ) : (
                            <SheetClose asChild key={item.url}>
                              <Link
                                href={item.url!}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                                  isActive
                                    ? "bg-secondary text-sidebar-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{item.title}</span>
                              </Link>
                            </SheetClose>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}