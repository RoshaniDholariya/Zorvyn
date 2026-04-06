const Joi = require('joi');

const roleEnum = ['VIEWER', 'ANALYST', 'ADMIN'];
const recordTypeEnum = ['INCOME', 'EXPENSE'];

exports.authRegister = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  adminCode: Joi.string().max(120).allow('', null),
});

exports.authLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

exports.recordCreate = Joi.object({
  amount: Joi.number().precision(2).positive().required(),
  type: Joi.string().valid(...recordTypeEnum).required(),
  category: Joi.string().max(80).required(),
  date: Joi.date().iso().required(),
  note: Joi.string().max(500).allow('', null),
});

exports.recordUpdate = Joi.object({
  amount: Joi.number().precision(2).positive(),
  type: Joi.string().valid(...recordTypeEnum),
  category: Joi.string().max(80),
  date: Joi.date().iso(),
  note: Joi.string().max(500).allow('', null),
}).min(1);

exports.queryFilters = Joi.object({
  type: Joi.string().valid(...recordTypeEnum).optional(),
  category: Joi.string().max(80).optional(),
  search: Joi.string().max(120).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().valid(10, 20, 50).default(20),
  userId: Joi.number().integer().min(1).optional(),
});

exports.userRole = Joi.object({ role: Joi.string().valid(...roleEnum).required() });
exports.userStatus = Joi.object({ isActive: Joi.boolean().required() });
exports.adminCreateUser = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid(...roleEnum).default('VIEWER')
});
