const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
      , orderBy: { createdAt: 'desc' }, skip, take: Number(pageSize)
      }),
      prisma.user.count()
    ]);
    res.json({ data: users, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ msg: "role is required" });

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role }
    });
    res.json({ id: user.id, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    if (isActive === undefined) return res.status(400).json({ msg: "isActive is required" });

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { isActive }
    });
    res.json({ id: user.id, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.adminCreate = async (req, res) => {
  try {
    const { name, email, password, role = 'VIEWER' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "name, email, password are required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
