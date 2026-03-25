import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import advertiserRoutes from './routes/advertiserRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { setupSwagger } from './swagger.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.lddvgty.mongodb.net/tetrify_db?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Basic test route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB');
});

// Swagger UI Docs
setupSwagger(app);

// Auth Routes
app.use('/auth', authRoutes);

// Advertiser Routes
app.use('/advertiser', advertiserRoutes);

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
