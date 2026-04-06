import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import DonutChart from "../components/charts/DonutChart";
import MiniBarChart from "../components/charts/MiniBarChart";
import { getDashboardSummaryApi } from "../api/dashboardApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialFilters = {
  type: "",
  category: "",
  search: "",
  startDate: "",
  endDate: "",
};

export default function DashboardPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const netBalance = summary?.netBalance || 0;
  const isNetPositive = netBalance >= 0;
  const categoryTotals = Object.entries(summary?.categoryTotals || {})
    .map(([key, value]) => ({ key, value: Number(value) || 0 }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const loadSummary = async ({ notifySuccess = false } = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboardSummaryApi(filters);
      setSummary(data);
      if (notifySuccess) toast.success("Dashboard updated.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Card className="overflow-hidden border-slate-200 lg:col-span-3">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Analytics</p>
              <CardTitle>Live Summary</CardTitle>
            </div>
            <Button variant="outline" onClick={() => loadSummary({ notifySuccess: true })}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Input name="search" placeholder="Search note/category" value={filters.search} onChange={onFilterChange} className="h-10" />
            <select name="type" value={filters.type} onChange={onFilterChange} className="h-10 rounded-lg border border-input px-2.5 text-sm">
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            <Input name="category" placeholder="Category" value={filters.category} onChange={onFilterChange} className="h-10" />
            <Input type="date" name="startDate" value={filters.startDate} onChange={onFilterChange} className="h-10" />
            <Input type="date" name="endDate" value={filters.endDate} onChange={onFilterChange} className="h-10" />
            <Button onClick={() => loadSummary({ notifySuccess: true })} className="h-10">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-emerald-200 bg-emerald-50/80">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/40 blur-3xl" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <ArrowUpCircle className="h-4 w-4" />
            <p className="text-sm font-medium">Total Income</p>
          </div>
          <CardTitle className="text-4xl text-emerald-900">Rs. {totalIncome.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="relative overflow-hidden border-rose-200 bg-rose-50/80">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-400/40 blur-3xl" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center gap-2 text-rose-700">
            <ArrowDownCircle className="h-4 w-4" />
            <p className="text-sm font-medium">Total Expenses</p>
          </div>
          <CardTitle className="text-4xl text-rose-900">Rs. {totalExpense.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      <Card
        className={`relative overflow-hidden ${
          isNetPositive ? "border-cyan-200 bg-cyan-50/80" : "border-amber-200 bg-amber-50/80"
        }`}
      >
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${
            isNetPositive ? "bg-cyan-400/40" : "bg-amber-400/40"
          }`}
        />
        <CardHeader className="relative">
          <div className={`mb-2 flex items-center gap-2 ${isNetPositive ? "text-cyan-700" : "text-amber-700"}`}>
            <Wallet className="h-4 w-4" />
            <p className="text-sm font-medium">Net Balance</p>
          </div>
          <CardTitle className={isNetPositive ? "text-4xl text-cyan-900" : "text-4xl text-amber-900"}>
            Rs. {netBalance.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm font-medium text-destructive lg:col-span-3">{error}</p> : null}
      {loading ? <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary lg:col-span-3" /> : null}

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Category Mix</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChart data={summary?.categoryTotals || {}} />
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <MiniBarChart data={summary?.monthlyTrends || {}} />
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Category Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2">
            {categoryTotals.map(({ key, value }) => (
              <li
                key={key}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  value >= 0 ? "border-emerald-200 bg-emerald-50/70" : "border-rose-200 bg-rose-50/70"
                }`}
              >
                <span className="font-medium">{key}</span>
                <strong className={value >= 0 ? "text-emerald-700" : "text-rose-700"}>
                  {value >= 0 ? "+" : "-"} Rs. {Math.abs(value).toFixed(2)}
                </strong>
              </li>
            ))}
            {!categoryTotals.length ? (
              <li className="rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground">No category data.</li>
            ) : null}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-slate-200 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border  border-black/20">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="border-b px-2 py-2">ID</th>
                  <th className="border-b px-2 py-2">Type</th>
                  <th className="border-b px-2 py-2">Category</th>
                  <th className="border-b px-2 py-2">Amount</th>
                  <th className="border-b px-2 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(summary?.recentActivity || []).map((item) => (
                  <tr
                    key={item.id}
                    className={`text-sm ${item.type === "INCOME" ? "bg-emerald-50/70" : "bg-rose-50/70"}`}
                  >
                    <td className={`border-b px-2 py-2 ${item.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>{item.id}</td>
                    <td className={`border-b px-2 py-2 font-semibold ${item.type === "INCOME" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"}`}>{item.type}</td>
                    <td className={`border-b px-2 py-2 ${item.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>{item.category}</td>
                    <td className={`border-b px-2 py-2 font-semibold ${item.type === "INCOME" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"}`}>
                      Rs. {Number(item.amount).toFixed(2)}
                    </td>
                    <td className={`border-b px-2 py-2 ${item.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!summary?.recentActivity?.length ? (
                  <tr>
                    <td className="px-2 py-3 text-sm text-muted-foreground" colSpan={5}>
                      No recent activity found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
