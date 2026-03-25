import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Advertiser, PlatformUser } from '../models/index.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  shopify_store_url: z.string()
    .transform(val => val.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''))
    .refine(val => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: 'Shopify store URL must be a valid domain format without http(s):// or trailing slashes (e.g., saptamveda.com)'
    }),
  shopify_store_name: z.string().min(1, 'Shopify store name is required')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const signup = catchAsync(async (req, res) => {
  // Validate request via Zod
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }

  const { name, email, password, shopify_store_url, shopify_store_name } = parsed.data;

  // Check if user already exists
  const existingUser = await PlatformUser.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // 1. Find existing Advertiser by Shopify store URL or create a new one
  let savedAdvertiser = await Advertiser.findOne({ shopify_store_url });
  if (!savedAdvertiser) {
    const advertiser = new Advertiser({
      name,
      shopify_store_url,
      shopify_store_name
    });
    savedAdvertiser = await advertiser.save();
  }

  // 2. Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the PlatformUser entity
  const platformUser = new PlatformUser({
    email,
    password: hashedPassword,
    name,
    advertiser: savedAdvertiser._id
  });
  const savedPlatformUser = await platformUser.save();

  // 4. Generate JWT
  const token = jwt.sign(
    { id: savedPlatformUser._id, advertiserId: savedAdvertiser._id },
    process.env.JWT_SECRET || 'fallback_jwt_secret_tetrify',
    { expiresIn: '30d' }
  );

  // Return success
  return res.status(201).json(
    new ApiResponse({
      token,
      user: {
        id: savedPlatformUser._id,
        name: savedPlatformUser.name,
        email: savedPlatformUser.email,
        advertiserId: savedAdvertiser._id
      }
    }, 'Signup successful')
  );
});

export const login = catchAsync(async (req, res) => {
  // Validate request via Zod
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }

  const { email, password } = parsed.data;

  // Find the platform user
  const user = await PlatformUser.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Validate the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, advertiserId: user.advertiser },
    process.env.JWT_SECRET || 'fallback_jwt_secret_tetrify',
    { expiresIn: '30d' }
  );

  // Return success
  return res.status(200).json(
    new ApiResponse({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        advertiserId: user.advertiser
      }
    }, 'Login successful')
  );
});
