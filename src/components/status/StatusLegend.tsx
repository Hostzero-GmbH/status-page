"use client";

import { CheckCircle2, AlertTriangle, AlertCircle, XCircle, Wrench } from "lucide-react";

const legendItems = [
  { icon: CheckCircle2, label: "Operational", colorClass: "text-status-operational" },
  { icon: AlertTriangle, label: "Degraded Performance", colorClass: "text-status-degraded" },
  { icon: AlertCircle, label: "Partial Outage", colorClass: "text-status-partial" },
  { icon: XCircle, label: "Major Outage", colorClass: "text-status-major" },
  { icon: Wrench, label: "Maintenance", colorClass: "text-status-maintenance" },
];

export function StatusLegend() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
      {legendItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-1.5 min-w-0">
            <Icon className={`h-4 w-4 flex-shrink-0 ${item.colorClass}`} />
            <span className="truncate text-xs text-muted-foreground">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
