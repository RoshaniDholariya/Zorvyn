/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 */
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');

const { getSummary } = require('../controllers/dashboardController');

router.get('/', auth, validate(schemas.queryFilters, 'query'), getSummary);

module.exports = router;
