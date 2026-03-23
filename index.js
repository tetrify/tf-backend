import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
