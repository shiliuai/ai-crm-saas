import { Activity, FileText, Home, Settings, Users } from "lucide-react";

export const sidebarItems = [
  { icon: Home, labelKey: "dashboard", to: "/" },
  { icon: Activity, labelKey: "analytics", to: "/analytics" },
  { icon: Users, labelKey: "users", to: "/users" },
  { icon: FileText, labelKey: "reports", to: "/reports" },
  { icon: Settings, labelKey: "settings", to: "/settings" },
] as const;
