import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cityRoutes from './routes/cities.js';
import weatherRoutes from './routes/weather.js';
import cityInfoRoutes from './routes/cityInfo.js';
import cityLookupRouter from './routes/cityLookup.js';


// Load environment variables
dotenv.config();

// Debug environment variables


// Initialize express
const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/city', cityInfoRoutes);
app.use('/api/lookup-city', cityLookupRouter);


// Error handling middleware (uncommented for better error handling)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} at ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`);
});

export default app;