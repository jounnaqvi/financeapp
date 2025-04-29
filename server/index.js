import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import transactionRoutes from './routes/transactions.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/transactions', transactionRoutes);

// Serve frontend build files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'src', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'src', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Personal Finance Visualizer API (DEV)');
  });
}

console.log('NODE_ENV:', process.env.NODE_ENV);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finance-visualizer')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
