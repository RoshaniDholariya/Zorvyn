/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               amount: 500
 *               type: INCOME
 *               category: Salary
 *               date: 2026-04-01
 *               note: Monthly salary
 *     responses:
 *       200:
 *         description: Record created
 */
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');

const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

router.post('/', auth, role('ADMIN'), validate(schemas.recordCreate), createRecord);
router.get('/', auth, validate(schemas.queryFilters, 'query'), getRecords);
router.put('/:id', auth, role('ADMIN'), validate(schemas.recordUpdate), updateRecord);
router.delete('/:id', auth, role('ADMIN'), deleteRecord);

module.exports = router;
