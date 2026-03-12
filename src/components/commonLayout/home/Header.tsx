"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "@/shared/Logo/Logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Globe, Menu, ChevronDown } from "lucide-react";

/* ───────────────── ListItem ───────────────── */
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        {children && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        )}
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";

/* ───────────────── MENU DATA ───────────────── */

const productsMenu = [
  {
    title: "Marketing SMS",
    items: [
      { title: "SMS", href: "/products/sms" },
      { title: "RSM", href: "/products/rsm" },
      { title: "MMS", href: "/products/mms" },
      { title: "Two-way SMS", href: "/products/two-way-sms" },
      { title: "WhatsApp", href: "/products/whatsapp" },
    ],
  },
  {
    title: "Voice",
    items: [
      { title: "Post-call SMS", href: "/products/post-call-sms" },
      { title: "AI Group Call", href: "/products/ai-group-call" },
      { title: "Group Call", href: "/products/group-call" },
      { title: "Call Center", href: "/products/call-center" },
      { title: "SIP Trunk", href: "/products/sip-trunk" },
    ],
  },
  {
    title: "Number",
    items: [{ title: "DID Number", href: "/products/did-number" }],
  },
  {
    title: "ADS",
    href: "/products/voice",
    isDirect: true,
  },
];

const solutionsMenu = [
  {
    title: "Applications",
    href: "/solutions/healthcare",
    items: [
      { title: "Verification", href: "/products/verification" },
      { title: "Marketing", href: "/products/marketing" },
      { title: "Service", href: "/products/service" },
    ],
  },
  { title: "Industry", href: "/solutions/emergency" },
  { title: "Service", href: "/solutions/home-care" },
];

const partnersMenu = [
  { title: "Affiliate", href: "/partners/hospitals" },
  { title: "Agent", href: "/partners/ambulance" },
];

const resourcesMenu = [
  { title: "Developers Docs", href: "/resources/blog" },
  { title: "Quick Start", href: "/resources/help" },
  { title: "Q&A", href: "/resources/api" },
];

const aboutMenu = [
  { title: "Events", href: "/about/mission" },
  { title: "Blog", href: "/about/team" },
  { title: "Company", href: "/about/company" },
  { title: "Careers", href: "/about/careers" },
];

/* ───────────────── TRIGGER STYLE ───────────────── */
const triggerClass = cn(
  "bg-transparent text-primary-foreground px-3 py-2 text-sm font-medium transition-colors",
  "hover:bg-primary/80 data-[state=open]:bg-primary/80",
  "data-[state=open]:shadow-sm",
);

/* ───────────────── HEADER ───────────────── */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex lg:gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* PRODUCTS – Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass}>
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[620px] p-6 lg:w-[700px]">
                      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {productsMenu.map((section) =>
                          section.isDirect ? (
                            <ListItem
                              key={section.href}
                              title={section.title}
                              href={section.href}
                              className="md:col-span-2 lg:col-span-3 font-semibold"
                            />
                          ) : (
                            <li key={section.title} className="row-span-3">
                              <h4 className="mb-3 text-base font-semibold leading-none">
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.items.map((item) => (
                                  <ListItem
                                    key={item.href}
                                    title={item.title}
                                    href={item.href}
                                  />
                                ))}
                              </ul>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* SOLUTIONS */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass}>
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[380px] p-5 grid gap-3">
                      {solutionsMenu.map((item) =>
                        item.items ? (
                          <li key={item.href}>
                            <div className="mb-1 font-medium">{item.title}</div>
                            <ul className="ml-4 space-y-1.5 text-sm">
                              {item.items.map((sub) => (
                                <li key={sub.href}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={sub.href}
                                      className="text-muted-foreground hover:text-foreground transition"
                                    >
                                      {sub.title}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ) : (
                          <ListItem
                            key={item.href}
                            title={item.title}
                            href={item.href}
                          />
                        ),
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* PARTNERS - RESOURCES - ABOUT */}
                {[
                  { label: "Partners", items: partnersMenu },
                  { label: "Resources", items: resourcesMenu },
                  { label: "About Us", items: aboutMenu },
                ].map(({ label, items }) => (
                  <NavigationMenuItem key={label}>
                    <NavigationMenuTrigger className={triggerClass}>
                      {label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-[360px] p-5 grid gap-3">
                        {items.map((item) => (
                          <ListItem
                            key={item.href}
                            title={item.title}
                            href={item.href}
                          />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                {/* CONTACT – direct link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={triggerClass}>
                    <Link
                      href="/contact"
                      className={navigationMenuTriggerStyle()}
                    >
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* RIGHT SIDE – Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Globe className="h-4 w-4" />
              English
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/adminLogin">Log In</Link>
            </Button>

            <Button
              asChild
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full px-6"
            >
              <Link href="/signup">Free Trial</Link>
            </Button>
          </div>

          {/* MOBILE MENU */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full bg-primary text-primary-foreground border-l-primary-foreground/10 p-0"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-primary-foreground/10">
                  <Logo />
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="products">
                      <AccordionTrigger className="py-4 text-lg font-medium">
                        Products
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-6">
                          {productsMenu.map((group) => (
                            <div key={group.title}>
                              <div className="font-medium mb-2">
                                {group.title}
                              </div>
                              <ul className="space-y-2">
                                {group.items?.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      className="block py-1.5 text-muted hover:text-foreground transition"
                                    >
                                      {item.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {[
                      { label: "Solutions", items: solutionsMenu },
                      { label: "Partners", items: partnersMenu },
                      { label: "Resources", items: resourcesMenu },
                      { label: "About Us", items: aboutMenu },
                    ].map(({ label, items }) => (
                      <AccordionItem key={label} value={label.toLowerCase()}>
                        <AccordionTrigger className="py-4 text-lg font-medium">
                          {label}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="pl-4 space-y-3">
                            {items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block py-1.5 text-muted hover:text-foreground transition"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    <div className="py-4">
                      <Link
                        href="/contact"
                        className="block py-4 text-lg font-medium hover:text-accent transition"
                      >
                        Contact
                      </Link>
                    </div>
                  </Accordion>
                </div>

                {/* Mobile bottom actions */}
                <div className="p-6 border-t border-primary-foreground/10 mt-auto">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      asChild
                    >
                      <Link href="/adminLogin">Log In</Link>
                    </Button>
                    <Button
                      className="bg-fuchsia-600 hover:bg-fuchsia-700"
                      asChild
                    >
                      <Link href="/signup">Start Free Trial</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
