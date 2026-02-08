import * as React from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  default:
    "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
  secondary:
    "border-transparent bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
  outline: "text-[hsl(var(--foreground))]",
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
