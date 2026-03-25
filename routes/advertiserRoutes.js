import express from 'express';
import { getAdvertiser, updateAdvertiser } from '../controllers/advertiserController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Advertiser
 *   description: Advertiser management endpoints
 */

/**
 * @swagger
 * /advertiser:
 *   get:
 *     summary: Get logged-in user's advertiser account
 *     tags: [Advertiser]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved advertiser
 *       401:
 *         description: Not authorized
 *   
 *   post:
 *     summary: Update logged-in user's advertiser account
 *     tags: [Advertiser]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shopify_store_url:
 *                 type: string
 *               shopify_store_name:
 *                 type: string
 *               billing:
 *                 type: object
 *     responses:
 *       200:
 *         description: Successfully updated advertiser
 *       401:
 *         description: Not authorized
 *   
 *   put:
 *     summary: Update logged-in user's advertiser account (Alias for post)
 *     tags: [Advertiser]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shopify_store_url:
 *                 type: string
 *               shopify_store_name:
 *                 type: string
 *               billing:
 *                 type: object
 *     responses:
 *       200:
 *         description: Successfully updated advertiser
 *       401:
 *         description: Not authorized
 */
// Both routes are protected by the auth middleware
router.route('/')
  .get(protect, getAdvertiser)
  .post(protect, updateAdvertiser)
  .put(protect, updateAdvertiser); // Also allowing PUT for logical consistency

export default router;
