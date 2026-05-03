import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CreditCard, Palette, Shield, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useBillingQuery } from "@/lib/queries/billing";
import { useSessionQuery } from "@/lib/queries/session";

export const Route = createFileRoute("/(app)/settings")({
  component: Settings,
});

function Settings() {
  const { t } = useI18n();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("settings", "title")}</h2>
        <p className="text-muted-foreground">
          {t("settings", "description")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>{t("settings", "profile")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings", "profileDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("settings", "name")}</Label>
              <Input id="name" placeholder={t("settings", "namePlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("settings", "email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("settings", "emailPlaceholder")}
              />
            </div>
            <Button>{t("settings", "saveChanges")}</Button>
          </CardContent>
        </Card>

        {/* Billing */}
        <BillingCard />

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>{t("settings", "notifications")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings", "notificationsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">
                  {t("settings", "emailNotifications")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings", "emailNotificationsDescription")}
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">
                  {t("settings", "pushNotifications")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings", "pushNotificationsDescription")}
                </p>
              </div>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>{t("settings", "security")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings", "securityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline">{t("settings", "changePassword")}</Button>
            </div>
            <div className="space-y-2">
              <Button variant="outline">
                {t("settings", "enable2fa")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>{t("settings", "appearance")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings", "appearanceDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">{t("settings", "darkMode")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings", "darkModeDescription")}
                </p>
              </div>
              <Switch id="dark-mode" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BillingCard() {
  const { format, t } = useI18n();
  const { data: session } = useSessionQuery();
  const activeOrgId = session?.session?.activeOrganizationId;
  const { data: billing, isLoading } = useBillingQuery(activeOrgId);

  const returnUrl = window.location.href;

  async function handleUpgrade(plan: "starter" | "pro") {
    try {
      await auth.subscription.upgrade({
        plan,
        successUrl: returnUrl,
        cancelUrl: returnUrl,
      });
    } catch (error) {
      console.error("Failed to start upgrade:", error);
    }
  }

  async function handleManageBilling() {
    try {
      await auth.subscription.billingPortal({ returnUrl });
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  }

  const hasSubscription =
    billing?.status === "active" || billing?.status === "trialing";
  const isCanceling = hasSubscription && billing.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>{t("settings", "billing")}</CardTitle>
        </div>
        <CardDescription>
          {t("settings", "billingDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            {t("common", "loading")}
          </p>
        ) : hasSubscription ? (
          <>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {format("settings", "plan", {
                  plan:
                    billing.plan.charAt(0).toUpperCase() +
                    billing.plan.slice(1),
                })}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({billing.status})
                </span>
              </p>
              {billing.periodEnd && (
                <p className="text-sm text-muted-foreground">
                  {isCanceling
                    ? t("settings", "accessUntil")
                    : t("settings", "renewsOn")}{" "}
                  {new Date(billing.periodEnd).toLocaleDateString()}
                </p>
              )}
              {isCanceling && (
                <p className="text-sm text-amber-600">
                  {t("settings", "canceling")}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleManageBilling}>
              {t("settings", "manageBilling")}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("settings", "freePlan")}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpgrade("starter")}
              >
                {t("settings", "upgradeStarter")}
              </Button>
              <Button onClick={() => handleUpgrade("pro")}>
                {t("settings", "upgradePro")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
