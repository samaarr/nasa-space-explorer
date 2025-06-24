// backend/routes/neo.js
import express from 'express';
import { fetchFromNASA } from '../utils/fetchWrapper.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const start_date = req.query.start_date || new Date().toISOString().split('T')[0];
  const end_date = req.query.end_date || start_date;
  const API_KEY = process.env.NASA_API_KEY;

  if (!API_KEY) {
    console.error('❌ NASA_API_KEY is missing in Mars route');
    return res.status(500).json({ error: 'Server misconfigured: missing NASA API key' });
  }

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`;
  console.log('📡 Fetching NEO data from:', url);

  try {
    const data = await fetchFromNASA(url);
    res.json(data);
  } catch (err) {
    console.error('❌ NEO Route Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  }
});

export default router;
