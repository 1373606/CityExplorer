import express from 'express';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get weather for a city
router.get('/:cityId', authenticateUser, async (req, res) => {
  try {
    // In a real app, we would call a weather API here
    // For demo purposes, we'll return mock data
    
    const weather = {
      temperature: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 70) + 30, // Random humidity between 30-100%
      windSpeed: Math.floor(Math.random() * 20) + 1, // Random wind speed between 1-20 km/h
      forecast: [
        {
          day: 'Tomorrow',
          temperature: {
            min: Math.floor(Math.random() * 15) + 5,
            max: Math.floor(Math.random() * 15) + 20
          },
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)]
        },
        {
          day: 'Day after tomorrow',
          temperature: {
            min: Math.floor(Math.random() * 15) + 5,
            max: Math.floor(Math.random() * 15) + 20
          },
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)]
        }
      ]
    };
    
    res.json(weather);
  } catch (err) {
    console.error('Error fetching weather data:', err);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

export default router;