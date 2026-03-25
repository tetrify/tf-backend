import { z } from 'zod';
import { Advertiser } from '../models/index.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Schema for updating an advertiser
const updateAdvertiserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  shopify_store_url: z.string()
    .transform(val => val.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''))
    .refine(val => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: 'Shopify store URL must be a valid domain format without http(s):// or trailing slashes (e.g., saptamveda.com)'
    }).optional(),
  shopify_store_name: z.string().min(1, 'Shopify store name cannot be empty').optional(),
  billing: z.record(z.any()).optional()
});

// GET advertiser details for the logged-in user
export const getAdvertiser = catchAsync(async (req, res) => {
  // `req.advertiser` is attached by the `protect` auth middleware
  return res.status(200).json(new ApiResponse(req.advertiser, 'Advertiser details retrieved successfully'));
});

// POST (Update) advertiser details for the logged-in user
export const updateAdvertiser = catchAsync(async (req, res) => {
  // Validate request body
  const parsed = updateAdvertiserSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }

  const { name, shopify_store_url, shopify_store_name, billing } = parsed.data;

  // Update existing advertiser
  const updatedAdvertiser = await Advertiser.findByIdAndUpdate(
    req.advertiser._id,
    {
      $set: {
        ...(name !== undefined && { name }),
        ...(shopify_store_url !== undefined && { shopify_store_url }),
        ...(shopify_store_name !== undefined && { shopify_store_name }),
        ...(billing !== undefined && { billing })
      }
    },
    { new: true, runValidators: true } // Returns the updated document
  );

  return res.status(200).json(new ApiResponse(updatedAdvertiser, 'Advertiser updated successfully'));
});
