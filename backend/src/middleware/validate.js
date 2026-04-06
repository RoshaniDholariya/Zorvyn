const Joi = require('joi');

// Generic validation middleware
module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ msg: 'Validation failed', details: error.details.map(d => d.message) });
    }
    req[property] = value;
    next();
  };
};
