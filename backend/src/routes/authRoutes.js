/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               email: roshni@gmail.com
 *               password: 123456
 *     responses:
 *       200:
 *         description: Returns JWT token
 */

const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');
const { register, login, me } = require('../controllers/authController');

router.post('/register', validate(schemas.authRegister), register);
router.post('/login', validate(schemas.authLogin), login);
router.get('/me', auth, me);

module.exports = router;
