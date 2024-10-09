import express from 'express';
import connectDB from './config/db.js'; 
import authRoutes from './routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
