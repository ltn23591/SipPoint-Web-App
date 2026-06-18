import { cn } from "@/lib/utils";

/**
 * Khung section dùng chung cho trang landing.
 * - `id` để Navbar anchor tới (scroll mượt).
 * - `eyebrow` / `title` / `description` là phần header tuỳ chọn.
 * - `children` là nội dung sẽ điền sau (hiện đang để trống/placeholder).
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  containerClassName,
  children,
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-16 sm:py-24", className)}
    >
      <div className={cn("container", containerClassName)}>
        {(eyebrow || title || description) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
