import { useI18n } from "@/lib/i18n";
import { Button } from "@repo/ui";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-6 text-muted-foreground">
          {t("notFound", "message")}
        </p>
        <Button asChild>
          <Link to="/">{t("notFound", "action")}</Link>
        </Button>
      </div>
    </div>
  );
}
