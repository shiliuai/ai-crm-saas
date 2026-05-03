import { useI18n } from "@/lib/i18n";
import { Button } from "@repo/ui";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useI18n();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      title={t("language", "toggleLabel")}
      aria-label={t("language", "toggleLabel")}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-semibold">
        {language === "en" ? "中文" : "EN"}
      </span>
    </Button>
  );
}
