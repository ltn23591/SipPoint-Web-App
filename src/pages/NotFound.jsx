import { Button } from "@/components/ui/button";
import { ROUTE_PATH } from "@/constants/routePaths";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background dark:bg-surface-dim px-4 text-center transition-colors duration-300">
      <p className="text-7xl font-bold text-primary dark:text-on-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground dark:text-on-surface">
        Không tìm thấy trang
      </h1>
      <p className="mt-2 text-muted-foreground dark:text-on-surface-variant">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <Button className="mt-8" size="lg" asChild>
        <a href={ROUTE_PATH.HOME}>Quay về trang chủ</a>
      </Button>
    </div>
  );
};

export default NotFound;
