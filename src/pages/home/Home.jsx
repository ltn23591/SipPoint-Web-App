import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/constants/application";
import { SECTION_ID } from "@/constants/routePaths";

/**
 * Trang landing one-page. Hiện tại Hero có nội dung mẫu, các section còn lại
 * là KHUNG RỖNG (placeholder) để điền nội dung sau — mỗi section đã gắn sẵn
 * `id` khớp với anchor trên Navbar.
 */
function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        id={SECTION_ID.HERO}
        className="relative scroll-mt-20 overflow-hidden bg-gradient-background dark:bg-surface-container-lowest"
      >
        <div className="container flex flex-col items-center py-24 text-center sm:py-32">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl dark:text-on-surface">
            {APP_TAGLINE}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground dark:text-on-surface-variant">
            {APP_DESCRIPTION}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="dark:bg-primary-container dark:text-on-primary-container dark:hover:bg-primary">
              <a href={`#${SECTION_ID.CONTACT}`}>
                Dùng thử miễn phí
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="dark:border-outline-variant dark:text-on-surface dark:hover:bg-surface-container">
              <a href={`#${SECTION_ID.HOW_IT_WORKS}`}>Xem cách hoạt động</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Các section khung rỗng — điền nội dung sau ──────────────────── */}
      <Section
        id={SECTION_ID.FEATURES}
        eyebrow="Tính năng"
        title="Mọi thứ quán bạn cần"
        description="Phần nội dung tính năng sẽ được bổ sung tại đây."
        className="dark:bg-surface"
      >
        <PlaceholderBody />
      </Section>

      <Section
        id={SECTION_ID.HOW_IT_WORKS}
        eyebrow="Cách hoạt động"
        title="Bắt đầu trong vài phút"
        description="Phần mô tả quy trình sẽ được bổ sung tại đây."
        className="bg-background-secondary dark:bg-surface-container-low"
      >
        <PlaceholderBody />
      </Section>

      <Section
        id={SECTION_ID.PRICING}
        eyebrow="Bảng giá"
        title="Gói phù hợp với mọi quy mô"
        description="Phần bảng giá sẽ được bổ sung tại đây."
        className="dark:bg-surface"
      >
        <PlaceholderBody />
      </Section>

      <Section
        id={SECTION_ID.FAQ}
        eyebrow="FAQ"
        title="Câu hỏi thường gặp"
        description="Phần câu hỏi thường gặp sẽ được bổ sung tại đây."
        className="bg-background-secondary dark:bg-surface-container-low"
      >
        <PlaceholderBody />
      </Section>

      <Section
        id={SECTION_ID.CONTACT}
        eyebrow="Liên hệ"
        title="Sẵn sàng bắt đầu?"
        description="Phần form liên hệ / đăng ký dùng thử sẽ được bổ sung tại đây."
        className="dark:bg-surface"
      >
        <PlaceholderBody />
      </Section>
    </>
  );
}

/** Placeholder hiển thị khi section chưa có nội dung. */
function PlaceholderBody() {
  return (
    <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-border bg-card/50 text-sm text-muted-foreground dark:border-outline-variant dark:bg-surface-container-high dark:text-on-surface-variant">
      Nội dung sẽ được bổ sung
    </div>
  );
}

export default Home;