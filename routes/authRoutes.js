import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API endpoints
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new platform user and advertiser
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - shopify_store_url
 *               - shopify_store_name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               shopify_store_url:
 *                 type: string
 *               shopify_store_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/signup', signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the platform
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', login);

export default router;
