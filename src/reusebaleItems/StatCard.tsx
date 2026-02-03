/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value?: string | number;
  iconName: string;
  description?: string;
  status?: string;
  iconNameAnother?: string;
  iconColorClassNameAnother?: string;
  href?: string;
  className?: string;
  iconClassName?: string;
  iconColorClassName?: string;
}

export function StatsCard({
  title,
  value,
  iconName,
  description,
  status,
  iconNameAnother,
  iconColorClassNameAnother,
  href,
  className,
  iconClassName,
  iconColorClassName = "text-primary",
}: StatsCardProps) {
  const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
  const IconAnother = iconNameAnother ? (Icons as any)[iconNameAnother] || null : null;

  const statusColorMap: Record<string, string> = {
    UrgentCare: "bg-amber-500/90 text-amber-950",
    RoutineCare: "bg-blue-500/90 text-blue-950",
    PhysicianCare: "bg-purple-500/90 text-purple-950",
  };

  const statusClass = status ? statusColorMap[status.replace(" ", "")] : undefined;

  const cardContent = (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]",
        className
      )}
    >
      <CardContent className="flex items-center gap-4 p-5 sm:p-6">
        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            iconClassName || "bg-primary/10"
          )}
        >
          <Icon className={cn("h-6 w-6", iconColorClassName)} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {status && (
              <Badge variant="secondary" className={cn("text-xs", statusClass)}>
                {status}
              </Badge>
            )}
          </div>

          {value && <div className="mt-1 text-xl font-semibold">{value}</div>}

          {description && (
            <p className="mt-1 text-sm text-muted-foreground leading-snug">
              {description}
            </p>
          )}
        </div>

        {/* Chevron (if present) */}
        {IconAnother && (
          <IconAnother
            className={cn("h-5 w-5 shrink-0 text-muted-foreground", iconColorClassNameAnother)}
          />
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{cardContent}</Link> : cardContent;
}