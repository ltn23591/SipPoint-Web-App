import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/Logo";
import { NAV_ITEMS } from "@/constants/navItems";
import { SECTION_ID } from "@/constants/routePaths";
import { useUiStore } from "@/stores/uiStore";

export function Navbar() {
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="lg" asChild>
            <a href={`#${SECTION_ID.CONTACT}`}>Đăng nhập</a>
          </Button>
          <Button size="lg" asChild>
            <a href={`#${SECTION_ID.CONTACT}`}>Dùng thử miễn phí</a>
          </Button>
        </div>

        {/* Mobile nav */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Mở menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="outline" size="lg" asChild>
                <a
                  href={`#${SECTION_ID.CONTACT}`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  Đăng nhập
                </a>
              </Button>
              <Button size="lg" asChild>
                <a
                  href={`#${SECTION_ID.CONTACT}`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  Dùng thử miễn phí
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
