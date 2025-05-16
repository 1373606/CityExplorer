import express from 'express';
import supabase from '../supabaseClient.js'; // Adjust path as needed
import crypto from 'crypto';
import fetch from 'node-fetch'; // at the top
const router = express.Router();
import dotenv from 'dotenv';
import axios from 'axios';
import dayjs from 'dayjs';

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;


// Get all cities

dotenv.config();

// ✅ GET all cities (e.g. for homepage, limited display, or filters)
router.get('/', async (req, res) => {
  try {
    const { search, country, minPopulation, maxPopulation } = req.query;

    let query = supabase.from('cities').select('id, name, country, population, timezone, image, description, timezone');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (country) {
      query = query.ilike('country', `%${country}%`);
    }

    if (minPopulation) {
      query = query.gte('population', parseInt(minPopulation));
    }

    if (maxPopulation) {
      query = query.lte('population', parseInt(maxPopulation));
    }

    query = query.order('id', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching cities with filters:', err);
    res.status(500).json({ message: 'Internal server error while filtering cities' });
  }
});



async function fetchWeather(cityName) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
  );
  const w = response.data;
  return {
    temperature: w.main.temp,
    condition: w.weather[0].main,
    humidity: w.main.humidity,
    windSpeed: w.wind.speed,
    icon: w.weather[0].icon,
  };
}

// ✅ KEEP ONLY THIS
router.get('/:id', async (req, res) => {
  try {
    const { data: city, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !city) {
      return res.status(404).json({ message: 'City not found' });
    }

    const now = dayjs();
    const lastUpdated = dayjs(city.weather_updated_at);
    let weather = city.weather;

    const needsUpdate = !weather || !lastUpdated.isValid() || now.diff(lastUpdated, 'hour') >= 24;

    if (needsUpdate) {
      weather = await fetchWeather(city.name);

      await supabase
        .from('cities')
        .update({
          weather,
          weather_updated_at: now.toISOString(),
        })
        .eq('id', city.id);
    }

    res.json({ ...city, weather });
  } catch (err) {
    console.error('Error fetching city with weather:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Get city by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'City not found' });
      }
      throw error;
    }

    // Fetch weather from OpenWeather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&units=metric&appid=${API_KEY}`;

    const weatherRes = await fetch(weatherUrl);
    const weatherJson = await weatherRes.json();

    const weather = {
      temperature: weatherJson.main?.temp,
      condition: weatherJson.weather?.[0]?.main || 'Unknown',
      humidity: weatherJson.main?.humidity,
      windSpeed: weatherJson.wind?.speed,
      icon: weatherJson.weather?.[0]?.icon,
    };

    res.json({ ...data, weather });
  } catch (err) {
    console.error('Error fetching city or weather:', err);
    res.status(500).json({ message: 'Internal server error while fetching city' });
  }
});
// Create a new city
router.post('/', async (req, res) => {
  try {
    const { name, country, description, population, timezone, latitude, longitude, currency, language, image, attractions } = req.body;

    if (!name || !country || !description || !image) {
      return res.status(400).json({ message: 'Missing required fields: name, country, description, and image are required' });
    }

    const { data, error } = await supabase
      .from('cities')
      .insert({
        id: crypto.randomUUID(),
        name,
        country,
        description,
        population: parseInt(population) || 0,
        timezone: timezone || 'GMT+0',
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        currency: currency || '',
        language: language || '',
        image,
        attractions: attractions || [],
      })
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Error creating city:', err);
    res.status(500).json({ message: 'Internal server error while creating city' });
  }
});

// Update a city
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select()
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'City not found' });
      }
      throw error;
    }

    const { name, country, description, population, timezone, latitude, longitude, currency, language, image, attractions } = req.body;

    const { data: updatedData, error: updateError } = await supabase
      .from('cities')
      .update({
        name,
        country,
        description,
        population: parseInt(population) || data.population,
        timezone: timezone || data.timezone,
        latitude: parseFloat(latitude) || data.latitude,
        longitude: parseFloat(longitude) || data.longitude,
        currency: currency || data.currency,
        language: language || data.language,
        image,
        attractions: attractions || data.attractions,
      })
      .eq('id', req.params.id)
      .select();

    if (updateError) throw updateError;

    res.json(updatedData[0]);
  } catch (err) {
    console.error('Error updating city:', err);
    res.status(500).json({ message: 'Internal server error while updating city' });
  }
});

// Delete a city
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'City not found' });
      }
      throw error;
    }

    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    console.error('Error deleting city:', err);
    res.status(500).json({ message: 'Internal server error while deleting city' });
  }
});

export default router;