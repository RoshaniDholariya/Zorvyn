const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');
const { listUsers, updateRole, updateStatus, adminCreate } = require('../controllers/userController');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth, role('ADMIN'), validate(schemas.queryFilters, 'query'), listUsers);
router.post('/', auth, role('ADMIN'), validate(schemas.adminCreateUser), adminCreate);
router.patch('/:id/role', auth, role('ADMIN'), validate(schemas.userRole), updateRole);
router.patch('/:id/status', auth, role('ADMIN'), validate(schemas.userStatus), updateStatus);

module.exports = router;
