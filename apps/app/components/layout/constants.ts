import {
  Activity,
  FileText,
  Handshake,
  Home,
  Settings,
  Users,
} from "lucide-react";

export const sidebarItems = [
  { icon: Home, labelKey: "dashboard", to: "/" },
  { icon: Handshake, labelKey: "crm", to: "/crm" },
  { icon: Activity, labelKey: "analytics", to: "/analytics" },
  { icon: Users, labelKey: "users", to: "/users" },
  { icon: FileText, labelKey: "reports", to: "/reports" },
  { icon: Settings, labelKey: "settings", to: "/settings" },
] as const;
