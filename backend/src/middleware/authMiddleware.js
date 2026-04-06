const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ msg: "User not found" });
    if (!user.isActive) return res.status(403).json({ msg: "User is inactive" });

    req.user = { id: user.id, role: user.role, email: user.email };

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
