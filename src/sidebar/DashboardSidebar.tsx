"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_CONFIG, hasChildren } from "./sidebar.config";
import { cn } from "@/lib/utils";
import Logo from "@/shared/Logo/Logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuIcon, XIcon, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { UserRole } from "@/types/user.role";

interface SidebarProps {
  role: UserRole;
}

interface DesktopSidebarProps {
  role: UserRole;
  pathname: string;
  openDropdowns: Set<string>;
  toggleDropdown: (title: string) => void;
  isDropdownOpen: (title: string) => boolean;
}

interface MobileSidebarProps {
  role: UserRole;
  pathname: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openDropdowns: Set<string>;
  toggleDropdown: (title: string) => void;
  isDropdownOpen: (title: string) => boolean;
}

// Desktop Sidebar Component
const DesktopSidebar = ({
  role,
  pathname,
  openDropdowns,
  toggleDropdown,
  isDropdownOpen,
}: DesktopSidebarProps) => (
  <motion.aside
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="hidden lg:flex w-64 min-h-screen border-r border-white/5 bg-gray-900/40 backdrop-blur-2xl flex-col sticky top-0 h-screen overflow-hidden"
  >
    {/* Logo Section */}
    <div className="flex items-center justify-center h-20 border-b border-white/5 px-6">
      <Logo />
    </div>

    {/* Navigation Container */}
    <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar">
      {SIDEBAR_CONFIG.filter((section) => section.roles.includes(role)).map(
        (section, i) => (
          <div key={i} className="space-y-2">
            {/* Section Title */}
            <div className="px-3 py-1">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                // Normalize paths by removing trailing slashes for comparison
                const normalizedPathname = pathname.replace(/\/$/, "");
                const normalizedItemUrl = item.url?.replace(/\/$/, "");

                const isActive =
                  normalizedPathname === normalizedItemUrl ||
                  item.items?.some(
                    (sub) => normalizedPathname === sub.url?.replace(/\/$/, ""),
                  );
                const isExactActive = normalizedPathname === normalizedItemUrl;
                const Icon = item.icon;

                return (
                  <div key={item.title} className="relative">
                    {hasChildren(item) ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.title)}
                          className={cn(
                            "group flex items-center justify-between w-full gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                            isActive
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "hover:bg-white/5 text-gray-300 hover:text-white border border-transparent",
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={cn(
                                "p-1 rounded-md transition-colors flex-shrink-0",
                                isActive
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-gray-800/40 text-gray-500 group-hover:text-gray-300",
                              )}
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                            </div>
                            <span className="truncate text-left">
                              {item.title}
                            </span>
                          </div>
                          <motion.div
                            animate={{
                              rotate: isDropdownOpen(item.title) ? 180 : 0,
                            }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="h-4 w-4 opacity-60" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isDropdownOpen(item.title) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-4 mt-1 space-y-0.5 overflow-hidden"
                            >
                              {item.items?.map((subItem) => {
                                const subIsActive =
                                  normalizedPathname ===
                                  subItem.url?.replace(/\/$/, "");
                                return (
                                  <Link
                                    key={subItem.url}
                                    href={subItem.url!}
                                    className={cn(
                                      "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 border border-transparent",
                                      subIsActive
                                        ? "bg-amber-500/20 text-amber-400"
                                        : "hover:bg-white/5 text-gray-400 hover:text-gray-200",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-1 h-1 rounded-full flex-shrink-0",
                                        subIsActive
                                          ? "bg-amber-400"
                                          : "bg-gray-600",
                                      )}
                                    />
                                    <span className="truncate text-left">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.url!}
                        className={cn(
                          "group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 border relative",
                          isExactActive
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "hover:bg-white/5 text-gray-300 hover:text-white border-transparent",
                        )}
                      >
                        <div
                          className={cn(
                            "p-1 rounded-md transition-colors flex-shrink-0",
                            isExactActive
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-gray-800/40 text-gray-500 group-hover:text-gray-300",
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                        </div>
                        <span className="truncate text-left">{item.title}</span>
                        {isExactActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-400 rounded-r-full"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ),
      )}
    </nav>
  </motion.aside>
);

// Mobile Sidebar Component
const MobileSidebar = ({
  role,
  pathname,
  isOpen,
  setIsOpen,
  openDropdowns,
  toggleDropdown,
  isDropdownOpen,
}: MobileSidebarProps) => (
  <div className="lg:hidden fixed top-0 left-0 w-full z-50 pointer-events-none">
    <div className="p-4 pointer-events-auto">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="bg-gray-900 border border-white/5 p-2 rounded-xl text-white shadow-2xl active:scale-95 transition-transform">
            {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 bg-gray-900 border-r border-white/5"
        >
          <div className="flex flex-col h-full overflow-hidden">
            <div className="h-16 flex items-center justify-center border-b border-white/5">
              <Logo />
            </div>
            <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-6">
              {SIDEBAR_CONFIG.filter((section) =>
                section.roles.includes(role),
              ).map((section, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <div key={item.title}>
                        {hasChildren(item) ? (
                          <div className="space-y-1">
                            <button
                              onClick={() => toggleDropdown(item.title)}
                              className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-gray-400"
                            >
                              <span className="flex items-center gap-3">
                                {item.icon && <item.icon size={16} />}
                                {item.title}
                              </span>
                              <ChevronDown
                                size={14}
                                className={cn(
                                  "transition-transform",
                                  isDropdownOpen(item.title) && "rotate-180",
                                )}
                              />
                            </button>
                            {isDropdownOpen(item.title) && (
                              <div className="ml-8 space-y-1">
                                {item.items?.map((sub) => (
                                  <SheetClose asChild key={sub.url}>
                                    <Link
                                      href={sub.url!}
                                      className={cn(
                                        "block px-4 py-2 text-xs font-bold",
                                        pathname === sub.url
                                          ? "text-amber-500"
                                          : "text-gray-500",
                                      )}
                                    >
                                      {sub.title}
                                    </Link>
                                  </SheetClose>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <SheetClose asChild>
                            <Link
                              href={item.url!}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold",
                                pathname === item.url
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "text-gray-400",
                              )}
                            >
                              {item.icon && <item.icon size={16} />}
                              {item.title}
                            </Link>
                          </SheetClose>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </div>
);

const DashboardSidebar = React.memo(function DashboardSidebar({
  role,
}: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Auto-expand dropdown if child route is active
  useEffect(() => {
    SIDEBAR_CONFIG.forEach((section) => {
      section.items.forEach((item) => {
        if (
          hasChildren(item) &&
          item.items?.some((sub) => pathname === sub.url)
        ) {
          setOpenDropdowns((prev) => new Set(prev).add(item.title));
        }
      });
    });
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const isDropdownOpen = (title: string) => openDropdowns.has(title);

  return (
    <>
      <DesktopSidebar
        role={role}
        pathname={pathname}
        openDropdowns={openDropdowns}
        toggleDropdown={toggleDropdown}
        isDropdownOpen={isDropdownOpen}
      />
      <MobileSidebar
        role={role}
        pathname={pathname}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        openDropdowns={openDropdowns}
        toggleDropdown={toggleDropdown}
        isDropdownOpen={isDropdownOpen}
      />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
});

export default DashboardSidebar;
