import { Coffee } from "lucide-react";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/application";

export function Logo({ className }) {
  return (
    <a
      href="#hero"
      className={cn("inline-flex items-center gap-2 font-bold", className)}
      aria-label={APP_NAME}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
        <Coffee className="size-4" />
      </span>
      <span className="text-lg tracking-tight text-foreground">
        {APP_NAME}
      </span>
    </a>
  );
}
