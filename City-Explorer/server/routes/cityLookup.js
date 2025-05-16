import express from 'express';
import supabase from '../supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    //  1: Fetch full city info from my own info API
    const infoRes = await axios.get(`http://localhost:5005/api/city/info?name=${encodeURIComponent(name)}`);
    const info = infoRes.data;

    // 2: Check if city already exists
    const { data: existing, error: existingError } = await supabase
      .from('cities')
      .select('*')
      .eq('name', info.name)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) return res.json(existing); // Return existing record

    // 3: Insert enriched city into Supabase
    const insertRes = await supabase
      .from('cities')
      .insert([
        {
          id: uuidv4(),
          name: info.name,
          country: info.country,
          description: info.description,
          image: info.image,
          population: info.population,
          timezone: info.timezone
        }
      ])
      .select()
      .single();

    if (insertRes.error) throw insertRes.error;

    res.json(insertRes.data);
  } catch (err) {
    console.error('Error in lookup-city:', err);
    res.status(500).json({ message: 'Failed to save city.' });
  }
});

export default router;
