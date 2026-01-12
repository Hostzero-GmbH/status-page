"use client";

import Link from "next/link";
import { Wrench, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/RichText";

export interface MaintenanceItem {
  id: string;
  shortId: string;
  title: string;
  description: unknown; // Lexical richText object
  scheduledAt: string;
  duration: string;
  affectedServices: string[];
  status: "upcoming" | "in_progress" | "completed";
}

interface MaintenanceCardProps {
  maintenance: MaintenanceItem;
}

export function MaintenanceCard({ maintenance }: MaintenanceCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:shadow-md">
      {/* Mobile: stacked layout, Desktop: horizontal layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        {/* Icon and status badge row on mobile, icon only on desktop */}
        <div className="flex items-center justify-between sm:block">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-status-maintenance/10">
            <Wrench className="h-4 w-4 text-status-maintenance" />
          </div>
          {/* Status badge - visible only on mobile */}
          <span
            className={cn(
              "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:hidden",
              maintenance.status === "upcoming" && "bg-status-maintenance/10 text-status-maintenance",
              maintenance.status === "in_progress" && "bg-status-degraded/10 text-status-degraded",
              maintenance.status === "completed" && "bg-status-operational/10 text-status-operational"
            )}
          >
            {maintenance.status === "upcoming" && "Upcoming"}
            {maintenance.status === "in_progress" && "In Progress"}
            {maintenance.status === "completed" && "Completed"}
          </span>
        </div>

        {/* Content - full width on mobile */}
        <div className="flex flex-1 flex-col gap-2">
          {maintenance.shortId ? (
            <Link
              href={`/m/${maintenance.shortId}`}
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              {maintenance.title}
            </Link>
          ) : (
            <h4 className="font-semibold text-foreground">{maintenance.title}</h4>
          )}
          <div className="text-sm text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_u]:underline [&_s]:line-through [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80">
            <RichText content={maintenance.description} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {maintenance.scheduledAt}
            </span>
            {maintenance.duration && <span>Duration: {maintenance.duration}</span>}
          </div>
          {maintenance.affectedServices.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {maintenance.affectedServices.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status badge - visible only on desktop */}
        <span
          className={cn(
            "hidden flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:block",
            maintenance.status === "upcoming" && "bg-status-maintenance/10 text-status-maintenance",
            maintenance.status === "in_progress" && "bg-status-degraded/10 text-status-degraded",
            maintenance.status === "completed" && "bg-status-operational/10 text-status-operational"
          )}
        >
          {maintenance.status === "upcoming" && "Upcoming"}
          {maintenance.status === "in_progress" && "In Progress"}
          {maintenance.status === "completed" && "Completed"}
        </span>
      </div>
    </div>
  );
}
