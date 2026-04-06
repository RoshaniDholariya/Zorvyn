const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const isDbConnectivityError = (err) => {
  const message = err?.message || "";
  return (
    message.includes("Can't reach database server") ||
    message.includes("P1001") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ENOTFOUND")
  );
};

const sendServerError = (res, err) => {
  if (isDbConnectivityError(err)) {
    return res.status(503).json({ msg: "Database is unavailable right now. Please try again shortly." });
  }
  return res.status(500).json({ msg: "Internal server error" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ msg: "Name, email and password are required" });
    }

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) return res.status(409).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // bootstrap logic: first user becomes admin OR adminCode matches secret
    const userCount = await prisma.user.count();
    let role = 'VIEWER';
    const secret = process.env.ADMIN_SIGNUP_CODE;
    if (userCount === 0 || (secret && adminCode === secret)) {
      role = 'ADMIN';
    }

    const user = await prisma.user.create({
      data: { name: normalizedName, email: normalizedEmail, password: hashed, role }
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) return res.status(400).json({ msg: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.isActive) return res.status(403).json({ msg: "User is inactive" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
  } catch (err) {
    sendServerError(res, err);
  }
};
