import { useI18n } from "@/lib/i18n";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CalendarClock,
  DollarSign,
  Grid3X3,
  List,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/(app)/customers")({
  component: Customers,
});

type ViewMode = "cards" | "list";

function Customers() {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const customers = [
    {
      id: 1,
      name: "Sarah Chen",
      company: "Acme Cloud",
      segment: t("customers", "enterprise"),
      email: "sarah.chen@acmecloud.com",
      phone: "+1 (415) 555-0184",
      location: "San Francisco, CA",
      owner: "Mia",
      stage: t("customers", "negotiation"),
      value: "$84,000",
      nextStep: t("customers", "scheduleDemo"),
      due: t("customers", "today"),
      lastContact: t("customers", "lastContactTwoHours"),
      score: 92,
    },
    {
      id: 2,
      name: "Marcus Lee",
      company: "Northstar Finance",
      segment: t("customers", "midMarket"),
      email: "marcus.lee@northstar.example",
      phone: "+1 (212) 555-0198",
      location: "New York, NY",
      owner: "Noah",
      stage: t("customers", "proposal"),
      value: "$46,500",
      nextStep: t("customers", "sendProposal"),
      due: t("customers", "tomorrow"),
      lastContact: t("customers", "lastContactYesterday"),
      score: 78,
    },
    {
      id: 3,
      name: "Priya Raman",
      company: "BrightOps",
      segment: t("customers", "smallBusiness"),
      email: "priya@brightops.example",
      phone: "+1 (650) 555-0132",
      location: "Austin, TX",
      owner: "Ava",
      stage: t("customers", "qualified"),
      value: "$18,200",
      nextStep: t("customers", "confirmBudget"),
      due: t("customers", "friday"),
      lastContact: t("customers", "lastContactThreeDays"),
      score: 66,
    },
    {
      id: 4,
      name: "Elena Garcia",
      company: "Helio Retail",
      segment: t("customers", "enterprise"),
      email: "elena@helioretail.example",
      phone: "+1 (305) 555-0160",
      location: "Miami, FL",
      owner: "Liam",
      stage: t("customers", "onboarding"),
      value: "$128,000",
      nextStep: t("customers", "reviewHealth"),
      due: t("customers", "today"),
      lastContact: t("customers", "lastContactTwoHours"),
      score: 88,
    },
    {
      id: 5,
      name: "Daniel Brooks",
      company: "Maple Systems",
      segment: t("customers", "midMarket"),
      email: "daniel@maplesystems.example",
      phone: "+1 (604) 555-0117",
      location: "Seattle, WA",
      owner: "Mia",
      stage: t("customers", "renewal"),
      value: "$63,400",
      nextStep: t("customers", "prepareRenewal"),
      due: t("customers", "nextWeek"),
      lastContact: t("customers", "lastContactOneWeek"),
      score: 74,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("customers", "title")}</h2>
          <p className="text-muted-foreground">
            {t("customers", "description")}
          </p>
        </div>
        <Button className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          {t("customers", "addCustomer")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label={t("customers", "totalCustomers")}
          value="1,284"
          detail="+14% "
        />
        <MetricCard
          icon={TrendingUp}
          label={t("customers", "activeDeals")}
          value="326"
          detail="+8% "
        />
        <MetricCard
          icon={DollarSign}
          label={t("customers", "pipelineValue")}
          value="$2.8M"
          detail="+21% "
        />
        <MetricCard
          icon={CalendarClock}
          label={t("customers", "dueFollowUps")}
          value="18"
          detail={t("customers", "today")}
        />
      </div>

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <CardTitle>{t("customers", "title")}</CardTitle>
            <CardDescription>
              {t("customers", "customersDescription")}
            </CardDescription>
          </div>
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("customers", "searchPlaceholder")}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t("customers", "filter")}
            </Button>
          </div>

          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          ) : (
            <CustomerTable customers={customers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 rounded-md border bg-background p-1">
      <Button
        type="button"
        variant={value === "cards" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange("cards")}
        aria-label={t("customers", "cardView")}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange("list")}
        aria-label={t("customers", "listView")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

function CustomerCard({
  customer,
}: {
  customer: ReturnType<typeof getCustomerShape>;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{customer.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {customer.company}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label={t("customers", "actions")}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <InfoItem icon={Building2} label={customer.segment} />
        <InfoItem icon={MapPin} label={customer.location} />
        <InfoItem icon={Mail} label={customer.email} />
        <InfoItem icon={Phone} label={customer.phone} />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/50 p-3 text-sm">
        <div>
          <p className="text-muted-foreground">{t("customers", "stage")}</p>
          <p className="font-medium">{customer.stage}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t("customers", "value")}</p>
          <p className="font-medium">{customer.value}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t("customers", "owner")}</p>
          <p className="font-medium">{customer.owner}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t("customers", "lastContact")}</p>
          <p className="font-medium">{customer.lastContact}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {t("customers", "nextStep")}
          </p>
          <p className="truncate text-sm font-medium">{customer.nextStep}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {customer.due}
        </span>
      </div>
    </div>
  );
}

function CustomerTable({
  customers,
}: {
  customers: ReturnType<typeof getCustomerShape>[];
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">
                {t("customers", "customer")}
              </th>
              <th className="p-4 text-left font-medium">
                {t("customers", "company")}
              </th>
              <th className="p-4 text-left font-medium">
                {t("customers", "stage")}
              </th>
              <th className="p-4 text-left font-medium">
                {t("customers", "value")}
              </th>
              <th className="p-4 text-left font-medium">
                {t("customers", "owner")}
              </th>
              <th className="p-4 text-left font-medium">
                {t("customers", "nextStep")}
              </th>
              <th className="p-4 text-left font-medium">
                {t("customers", "actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium">{customer.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.segment}
                  </p>
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                    {customer.stage}
                  </span>
                </td>
                <td className="p-4 font-medium">{customer.value}</td>
                <td className="p-4">{customer.owner}</td>
                <td className="p-4">
                  <p className="font-medium">{customer.nextStep}</p>
                  <p className="text-sm text-muted-foreground">{customer.due}</p>
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("customers", "actions")}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
}: {
  icon: typeof Building2;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function getCustomerShape() {
  return {
    id: 0,
    name: "",
    company: "",
    segment: "",
    email: "",
    phone: "",
    location: "",
    owner: "",
    stage: "",
    value: "",
    nextStep: "",
    due: "",
    lastContact: "",
    score: 0,
  };
}
