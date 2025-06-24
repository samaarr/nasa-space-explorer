import express from 'express';
import { fetchFromNASA } from '../utils/fetchWrapper.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const rover = req.query.rover || 'curiosity';
  const date = req.query.date || '2020-07-01';
  const camera = req.query.camera || '';
  const API_KEY = process.env.NASA_API_KEY;

  if (!API_KEY) {
    console.error('❌ NASA_API_KEY is missing in Mars route');
    return res.status(500).json({ error: 'Server misconfigured: missing NASA API key' });
  }

  const cameraParam = camera ? `&camera=${camera}` : '';
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}${cameraParam}&api_key=${API_KEY}`;

  console.log('🔭 Fetching Mars photos from:', url);

  try {
    const data = await fetchFromNASA(url);
    res.json(data.photos); // ✅ Return only the photo array
  } catch (err) {
    console.error('❌ Mars Route Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Mars photos' });
  }
});

export default router;
