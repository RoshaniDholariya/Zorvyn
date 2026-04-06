const prisma = require("../config/db");

const buildFilters = (req) => {
  const { type, category, startDate, endDate, userId, search } = req.query;
  const where = {};

  if (type) where.type = type;
  if (category) where.category = category;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  if (search) {
    where.OR = [
      { note: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  // Access control: viewers only see their own records; analysts see all; admin can optionally scope by userId
  if (req.user.role === "VIEWER") {
    where.userId = req.user.id;
  } else if (userId && req.user.role === "ADMIN") {
    where.userId = Number(userId);
  }

  return where;
};

exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;
    const record = await prisma.record.create({
      data: {
        amount: Number(amount),
        type,
        category,
        date: new Date(date),
        note,
        userId: req.user.id,
      },
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const where = buildFilters(req);
    const skip = (Number(page) - 1) * Number(pageSize);
    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: Number(pageSize),
        include: {
          user: true, // include full user object
        },
      }),
      prisma.record.count({ where }),
    ]);
    res.json({
      data: records,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.record.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) return res.status(404).json({ msg: "Record not found" });

    const record = await prisma.record.update({
      where: { id: existing.id },
      data: req.body,
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.record.delete({
      where: { id: Number(id) },
    });

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.buildFilters = buildFilters;
