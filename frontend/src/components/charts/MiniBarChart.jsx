import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";

export default function MiniBarChart({ data = {}, emptyLabel = "No trend data." }) {
  const entries = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([month, value]) => ({
      month,
      shortMonth: month.split("-")[1] || month,
      value: Number(value) || 0,
    }));

  if (!entries.length) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={entries}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="shortMonth" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
          <Tooltip formatter={(value) => `Rs. ${Number(value).toFixed(2)}`} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {entries.map((entry) => (
              <Cell key={entry.month} fill={entry.value >= 0 ? "#16a34a" : "#dc2626"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
