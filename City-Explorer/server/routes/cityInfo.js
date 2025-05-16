import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;

async function fetchWikipediaSummary(cityName) {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    const data = response.data;
    return {
      name: data.title,
      description: data.extract,
      image: data.originalimage?.source || null
    };
  } catch (err) {
    console.error('Wikipedia API error:', err.message);
    return { name: cityName, description: '', image: null };
  }
}

async function fetchGeoNamesData(cityName) {
  try {
    const response = await axios.get('http://api.geonames.org/searchJSON', {
      params: {
        q: cityName,
        maxRows: 1,
        username: GEONAMES_USERNAME
      }
    });

    const result = response.data.geonames[0];
    return {
      country: result.countryName,
      population: result.population,
      timezone: result.timezone?.timeZoneId || ''
    };
  } catch (err) {
    console.error('GeoNames API error:', err.message);
    return { country: '', population: 0, timezone: '' };
  }
}

router.get('/info', async (req, res) => {
  const cityName = req.query.name;

  if (!cityName) {
    return res.status(400).json({ message: 'City name is required as query param ?name=' });
  }

  try {
    const [wikiData, geoData] = await Promise.all([
      fetchWikipediaSummary(cityName),
      fetchGeoNamesData(cityName)
    ]);

    res.json({
      name: wikiData.name,
      description: wikiData.description,
      image: wikiData.image,
      country: geoData.country,
      population: geoData.population,
      timezone: geoData.timezone
    });
  } catch (err) {
    console.error('City info fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch city info.' });
  }
});

export default router;
