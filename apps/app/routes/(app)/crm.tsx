import { useI18n } from "@/lib/i18n";
import { Button, Card, CardContent, Input } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";

export const Route = createFileRoute("/(app)/crm")({
  component: Crm,
});

const STORAGE_KEY = "crm-customers";

const stages = ["lead", "qualified", "proposal", "won"] as const;

type Stage = (typeof stages)[number];

interface Customer {
  id: string;
  name: string;
  stage: Stage;
}

const initialCustomers: Customer[] = [
  { id: "cust-acme", name: "Acme Corp", stage: "lead" },
  { id: "cust-nova", name: "Nova Labs", stage: "qualified" },
  { id: "cust-river", name: "River Studio", stage: "proposal" },
  { id: "cust-summit", name: "Summit Retail", stage: "won" },
];

function isStage(value: unknown): value is Stage {
  return typeof value === "string" && stages.includes(value as Stage);
}

function isCustomer(value: unknown): value is Customer {
  if (!value || typeof value !== "object") return false;

  const customer = value as Record<string, unknown>;
  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    isStage(customer.stage)
  );
}

function loadCustomers() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialCustomers;

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isCustomer)) {
    throw new Error("Invalid CRM customer data in localStorage");
  }

  return parsed;
}

function createCustomer(name: string, stage: Stage): Customer {
  return {
    id: window.crypto.randomUUID(),
    name,
    stage,
  };
}

function Crm() {
  const { format, t } = useI18n();
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomers());
  const [newCustomerName, setNewCustomerName] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleCustomers = useMemo(() => {
    if (!normalizedSearch) return customers;

    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(normalizedSearch),
    );
  }, [customers, normalizedSearch]);

  const totalCustomers = customers.length;
  const wonCustomers = customers.filter(
    (customer) => customer.stage === "won",
  ).length;
  const openCustomers = totalCustomers - wonCustomers;

  function addCustomer(stage: Stage) {
    const name = newCustomerName.trim();
    if (!name) return;

    setCustomers((currentCustomers) => [
      createCustomer(name, stage),
      ...currentCustomers,
    ]);
    setNewCustomerName("");
  }

  function handleAddCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addCustomer("lead");
  }

  function updateCustomerName(id: string, name: string) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === id ? { ...customer, name } : customer,
      ),
    );
  }

  function moveCustomer(id: string, stage: Stage) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === id ? { ...customer, stage } : customer,
      ),
    );
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, stage: Stage) {
    event.preventDefault();
    const customerId = event.dataTransfer.getData("text/plain");
    if (customerId) moveCustomer(customerId, stage);
  }

  function getCustomersForStage(stage: Stage) {
    return visibleCustomers.filter((customer) => customer.stage === stage);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("crm", "title")}</h2>
          <p className="text-muted-foreground">{t("crm", "description")}</p>
        </div>

        <form
          className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
          onSubmit={handleAddCustomer}
        >
          <Input
            value={newCustomerName}
            onChange={(event) => setNewCustomerName(event.target.value)}
            placeholder={t("crm", "customerPlaceholder")}
          />
          <Button type="submit" className="gap-2 sm:w-40">
            <Plus className="h-4 w-4" />
            {t("crm", "addCustomer")}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label={t("crm", "totalCustomers")} value={totalCustomers} />
        <Metric label={t("crm", "openPipeline")} value={openCustomers} />
        <Metric label={t("crm", "wonCustomers")} value={wonCustomers} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("crm", "searchPlaceholder")}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">{t("crm", "dragHint")}</p>
      </div>

      <div className="grid min-h-[28rem] grid-cols-1 gap-4 xl:grid-cols-4">
        {stages.map((stage) => {
          const stageCustomers = getCustomersForStage(stage);

          return (
            <section
              key={stage}
              className="flex min-h-80 flex-col rounded-lg border bg-muted/30"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, stage)}
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="font-semibold">{t("crm", stage)}</h3>
                <span className="rounded-full bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                  {stageCustomers.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 p-3">
                {stageCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", customer.id);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    <CardContent className="p-3">
                      <Input
                        value={customer.name}
                        onChange={(event) =>
                          updateCustomerName(customer.id, event.target.value)
                        }
                        aria-label={customer.name}
                      />
                    </CardContent>
                  </Card>
                ))}

                {stageCustomers.length === 0 ? (
                  <div className="rounded-md border border-dashed bg-background/60 p-4 text-center text-sm text-muted-foreground">
                    {normalizedSearch
                      ? t("crm", "noMatches")
                      : t("crm", "noCustomers")}
                  </div>
                ) : null}
              </div>

              <div className="border-t p-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => addCustomer(stage)}
                  disabled={!newCustomerName.trim()}
                >
                  <Plus className="h-4 w-4" />
                  {format("crm", "addToStage", { stage: t("crm", stage) })}
                </Button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
