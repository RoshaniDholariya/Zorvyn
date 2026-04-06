const prisma = require('../config/db');
const { buildFilters } = require('./recordController');

exports.getSummary = async (req, res) => {
  try {
    const where = buildFilters(req);
    const records = await prisma.record.findMany({ where, orderBy: { date: 'desc' } });

    let income = 0;
    let expense = 0;
    const categoryTotals = {};
    const monthly = {};
    const recentActivity = [];

    records.forEach(r => {
      if (r.type === 'INCOME') income += r.amount;
      else expense += r.amount;

      categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount * (r.type === 'INCOME' ? 1 : -1);

      const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = (monthly[key] || 0) + r.amount * (r.type === 'INCOME' ? 1 : -1);
    });

    // build recent activity (last 5 by date desc)
    records.slice(0, 5).forEach(r => {
      recentActivity.push({
        id: r.id,
        category: r.category,
        type: r.type,
        amount: r.amount,
        date: r.date
      });
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      categoryTotals,
      monthlyTrends: monthly,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
