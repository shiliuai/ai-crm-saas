import { useI18n } from "@/lib/i18n";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Download, FileText, Filter } from "lucide-react";

export const Route = createFileRoute("/(app)/reports")({
  component: Reports,
});

function Reports() {
  const { t } = useI18n();
  const reports = [
    {
      id: 1,
      name: t("reports", "monthlySales"),
      type: t("reports", "sales"),
      date: "2024-01-01",
      status: "ready",
    },
    {
      id: 2,
      name: t("reports", "userActivity"),
      type: t("reports", "analytics"),
      date: "2024-01-15",
      status: "ready",
    },
    {
      id: 3,
      name: t("reports", "financialSummary"),
      type: t("reports", "finance"),
      date: "2024-01-20",
      status: "processing",
    },
    {
      id: 4,
      name: t("reports", "performanceMetrics"),
      type: t("reports", "performance"),
      date: "2024-01-25",
      status: "ready",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("reports", "title")}</h2>
        <p className="text-muted-foreground">
          {t("reports", "description")}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reports", "filters")}</CardTitle>
          <CardDescription>
            {t("reports", "filtersDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t("reports", "selectReportType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("reports", "allTypes")}</SelectItem>
                  <SelectItem value="sales">{t("reports", "sales")}</SelectItem>
                  <SelectItem value="analytics">
                    {t("reports", "analytics")}
                  </SelectItem>
                  <SelectItem value="finance">
                    {t("reports", "finance")}
                  </SelectItem>
                  <SelectItem value="performance">
                    {t("reports", "performance")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t("reports", "selectDateRange")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">
                    {t("reports", "last7Days")}
                  </SelectItem>
                  <SelectItem value="30days">
                    {t("reports", "last30Days")}
                  </SelectItem>
                  <SelectItem value="90days">
                    {t("reports", "last90Days")}
                  </SelectItem>
                  <SelectItem value="year">{t("reports", "thisYear")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2">
              <Filter className="h-4 w-4" />
              {t("reports", "applyFilters")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reports", "generateNew")}</CardTitle>
          <CardDescription>
            {t("reports", "generateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>{t("reports", "salesReport")}</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>{t("reports", "userReport")}</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>{t("reports", "financialReport")}</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>{t("reports", "customReport")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reports", "recentReports")}</CardTitle>
          <CardDescription>{t("reports", "recentDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "ready"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t(
                      "reports",
                      report.status === "ready" ? "ready" : "processing",
                    )}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={report.status !== "ready"}
                    aria-label={t("reports", "download")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
