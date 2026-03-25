import jwt from 'jsonwebtoken';
import { PlatformUser, Advertiser } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_jwt_secret_tetrify'
    );

    // Get user and advertiser
    const user = await PlatformUser.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    const advertiser = await Advertiser.findById(decoded.advertiserId);
    if (!advertiser) {
      throw new ApiError(401, 'Advertiser no longer exists');
    }

    // Attach to request
    req.user = user;
    req.advertiser = advertiser;

    next();
  } catch (err) {
    throw new ApiError(401, 'Not authorized to access this route, token failed');
  }
});
