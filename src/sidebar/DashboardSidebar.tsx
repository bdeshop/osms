"use client";

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
import { useState, useEffect } from "react";
import { UserRole } from "@/types/user.role";

interface SidebarProps {
  role: UserRole;
}

export default function DashboardSidebar({ role }: SidebarProps) {
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

  // Desktop Sidebar
  const DesktopSidebar = () => (
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
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        {SIDEBAR_CONFIG.filter((section) => {
          const isRoleAllowed = section.roles.includes(role);
          if (!isRoleAllowed) return false;

          // If the user is an ADMIN, show either Admin or User panel based on route
          if (role === "ADMIN") {
            const isAdminRoute = pathname.startsWith("/admin");
            const isUserRoute = pathname.startsWith("/user");

            if (isAdminRoute && section.title === "User Panel") return false;
            if (isUserRoute && section.title === "Admin Panel") return false;
          }

          return true;
        }).map((section, i) => (
            <div key={i} className="space-y-3">
              {/* Section Title with Animated Underline */}
              <div className="px-3 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  {section.title}
                </h3>
                <div className="h-px w-8 bg-gray-800" />
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  // Normalize paths by removing trailing slashes for comparison
                  const normalizedPathname = pathname.replace(/\/$/, "");
                  const normalizedItemUrl = item.url?.replace(/\/$/, "");

                  const isActive =
                    normalizedPathname === normalizedItemUrl ||
                    item.items?.some(
                      (sub) =>
                        normalizedPathname === sub.url?.replace(/\/$/, ""),
                    );
                  const isExactActive =
                    normalizedPathname === normalizedItemUrl;
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="relative">
                      {hasChildren(item) ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.title)}
                            className={cn(
                              "group flex items-center justify-between w-full gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                              isActive
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5"
                                : "hover:bg-white/5 text-gray-400 hover:text-white border border-transparent",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-1.5 rounded-lg transition-colors",
                                  isActive
                                    ? "bg-amber-500/20 text-amber-500"
                                    : "bg-gray-800/50 text-gray-500 group-hover:text-white",
                                )}
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                              </div>
                              <span className="tracking-tight">
                                {item.title}
                              </span>
                            </div>
                            <motion.div
                              animate={{
                                rotate: isDropdownOpen(item.title) ? 180 : 0,
                              }}
                            >
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {isDropdownOpen(item.title) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="ml-6 mt-2 space-y-1 overflow-hidden"
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
                                        "flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 border border-transparent",
                                        subIsActive
                                          ? "bg-white/5 text-amber-500 border-white/5"
                                          : "hover:bg-white/5 text-gray-500 hover:text-gray-200",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "w-1.5 h-1.5 rounded-full",
                                          subIsActive
                                            ? "bg-amber-500 scale-125"
                                            : "bg-gray-700",
                                        )}
                                      />
                                      <span>{subItem.title}</span>
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
                            "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 border",
                            isExactActive
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5"
                              : "hover:bg-white/5 text-gray-400 hover:text-white border-transparent",
                          )}
                        >
                          <div
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              isExactActive
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-gray-800/50 text-gray-500 group-hover:text-white",
                            )}
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                          </div>
                          <span className="tracking-tight">{item.title}</span>
                          {isExactActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full"
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

      {/* Upgrade Service CTA */}
      <div className="p-4 mt-auto">
        <div className="bg-linear-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <Zap size={48} className="text-amber-500" />
          </div>
          <p className="text-[10px] font-black text-amber-500 uppercase mb-1">
            Professional
          </p>
          <p className="text-xs font-bold text-white mb-3">
            Expand your reach today
          </p>
          <button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-[10px] py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20">
            STAY PREMIUM
          </button>
        </div>
      </div>
    </motion.aside>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
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
                {/* Mobile menu content logic matches desktop but with SheetClose */}
                {SIDEBAR_CONFIG.filter((section) => {
                  const isRoleAllowed = section.roles.includes(role);
                  if (!isRoleAllowed) return false;

                  if (role === "ADMIN") {
                    const isAdminRoute = pathname.startsWith("/admin");
                    const isUserRoute = pathname.startsWith("/user");

                    if (isAdminRoute && section.title === "User Panel") return false;
                    if (isUserRoute && section.title === "Admin Panel") return false;
                  }

                  return true;
                }).map((section, i) => (
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

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
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
}
