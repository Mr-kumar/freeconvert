import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  dark?: boolean;
}

export function BrandLogo({
  className,
  markClassName,
  textClassName,
  dark = false,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <svg
        aria-hidden="true"
        className={cn("h-8 w-8 shrink-0", markClassName)}
        fill="none"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="256" cy="256" fill="#008ee9" r="244" />
        <path
          d="M96 108h154l42 42v170H96V108Z"
          fill="#ffffff"
        />
        <path d="M250 108v42h42l-42-42Z" fill="#bde7ff" />
        <path
          d="M132 266h124l-41-54-32 38-22-25-29 41Zm36-88a24 24 0 1 0 0 48 24 24 0 0 0 0-48Z"
          fill="#0063a8"
        />
        <path
          d="M220 192h154l42 42v170H220V192Z"
          fill="#ffffff"
        />
        <path d="M374 192v42h42l-42-42Z" fill="#bde7ff" />
        <path
          d="M258 268h116v22H258v-22Zm0 52h116v22H258v-22Zm0 52h74v22h-74v-22Z"
          fill="#0063a8"
        />
        <path
          d="M308 114h72l56 56-56 56h-72v-44h54l12-12-12-12h-54v-44Zm-104 284h-72l-56-56 56-56h72v44h-54l-12 12 12 12h54v44Z"
          fill="#043b63"
        />
      </svg>
      <span
        className={cn(
          "min-w-0 whitespace-nowrap font-extrabold leading-none",
          dark ? "text-white" : "text-[var(--text)]",
          textClassName,
        )}
      >
        Free<span className="text-[#008ee9]">Convert</span>
      </span>
    </span>
  );
}
