import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  ShieldUser,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/records", label: "Records", icon: ReceiptText },
  { to: "/users", label: "Users", role: "ADMIN", icon: Users },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavItems = navItems.filter((item) => !item.role || user?.role === item.role);

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)]">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-black/35 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen border-r bg-white p-3 shadow-xl transition-all duration-200 md:static md:flex md:h-full md:flex-col md:shadow-none ${
            mobileOpen ? "w-72 translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${collapsed ? "md:w-20" : "md:w-72"}`
          }
        >
          <div className={`mb-4 flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-2`}>
            <div className={`grid h-11 w-11 place-items-center rounded-2xl border bg-blue-600 text-white`}>
              <ShieldUser className="h-5 w-5" />
            </div>
            {!collapsed ? (
              <div>
                <h1 className="text-lg font-bold text-blue-700">Zorvyn</h1>
                <p className="text-xs text-slate-500">Finance Workspace</p>
              </div>
            ) : null}
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <nav className="grid flex-1 content-start gap-2 overflow-y-auto">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-blue-700 hover:bg-slate-100"
                  } ${collapsed ? "justify-center" : "px-3"}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-blue-700">
                  <item.icon className="h-4 w-4" />
                </span>
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            ))}
          </nav>

          <div className={`mt-4 flex flex-col justify-end border-t pt-3 ${collapsed ? "hidden md:block" : "block"}`}>
            {!collapsed ? (
              <div className="rounded-lg border bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-500">{user?.name}</p>
                <Badge variant="outline" className="mt-1">
                  {user?.role}
                </Badge>
              </div>
            ) : null}
            <Button
              variant="outline"
              onClick={logout}
              type="button"
              className={`mt-2 ${collapsed ? "w-full px-0 md:inline-flex md:justify-center" : "w-full"}`}
              title={collapsed ? "Logout" : undefined}
            >
              {collapsed ? <LogOut className="h-4 w-4" /> : "Logout"}
            </Button>
          </div>
        </aside>

        <section className="grid h-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden md:pl-0">
          <header className="z-20 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                className="md:hidden"
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="hidden md:inline-flex"
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Authenticated Session
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  {location.pathname === "/dashboard" ? "Finance Dashboard" : "Finance Workspace"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-1.5 ">
                <p className="text-xs text-muted-foreground">{user?.name}</p>
                <Badge variant="secondary">
                  {user?.role}
                </Badge>
              </div>
              <Button variant="outline" onClick={logout} type="button">
                Logout
              </Button>
            </div>
          </header>

          <main className="overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
