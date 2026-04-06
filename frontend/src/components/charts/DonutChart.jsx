import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const INCOME_COLORS = ["#16a34a", "#22c55e", "#4ade80", "#15803d"];
const EXPENSE_COLORS = ["#dc2626", "#ef4444", "#f87171", "#b91c1c"];

export default function DonutChart({ data = {}, emptyLabel = "No category data." }) {
  const entries = Object.entries(data)
    .map(([name, value]) => {
      const numeric = Number(value) || 0;
      const type = numeric >= 0 ? "INCOME" : "EXPENSE";
      return { name, value: Math.abs(numeric), rawValue: numeric, type };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  let incomeIndex = 0;
  let expenseIndex = 0;
  const colorMap = new Map();
  entries.forEach((entry) => {
    if (entry.type === "INCOME") {
      colorMap.set(entry.name, INCOME_COLORS[incomeIndex % INCOME_COLORS.length]);
      incomeIndex += 1;
    } else {
      colorMap.set(entry.name, EXPENSE_COLORS[expenseIndex % EXPENSE_COLORS.length]);
      expenseIndex += 1;
    }
  });

  if (!entries.length) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col min-w-0 gap-4 ">
      <div className="h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={entries}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={76}
              strokeWidth={1}
            >
              {entries.map((entry, index) => (
                <Cell key={entry.name} fill={colorMap.get(entry.name)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs. ${Number(value).toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid min-w-0 content-center gap-2">
        {entries.map((entry) => (
          <li
            key={entry.name}
            className="grid min-w-0 grid-cols-[12px_minmax(0,1fr)_minmax(90px,auto)] items-center gap-2 text-sm"
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colorMap.get(entry.name) }} />
            <span className="truncate text-muted-foreground">{entry.name}</span>
            <strong
              className={`justify-self-end text-right tabular-nums ${entry.type === "INCOME" ? "text-emerald-700" : "text-rose-700"}`}
            >
              {entry.value.toFixed(2)}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
