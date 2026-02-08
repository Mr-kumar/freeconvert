"use client";

import { Check, Loader2, Download, CloudUpload, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "upload", label: "Upload", icon: CloudUpload },
  { key: "processing", label: "Processing", icon: Settings },
  { key: "download", label: "Download", icon: Download },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export interface ProgressStepperProps {
  activeStep: StepKey;
  className?: string;
}

export function ProgressStepper({ activeStep, className }: ProgressStepperProps) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {STEPS.map((step, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isDone && "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white",
                  isActive && "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white",
                  !isDone && !isActive && "border-gray-200 bg-gray-100 text-gray-400"
                )}
              >
                {isDone ? (
                  <Check className="h-5 w-5" />
                ) : isActive && step.key === "processing" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs font-medium",
                  isDone || isActive ? "text-[hsl(var(--primary))]" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 sm:w-12",
                  i < activeIndex ? "bg-[hsl(var(--primary))]" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
