import express from 'express';
import { fetchFromNASA } from '../utils/fetchWrapper.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const date = req.query.date || '2024-05-30';
  const mode = req.query.mode || 'natural'; // "natural" or "enhanced"
  const API_KEY = process.env.NASA_API_KEY;

  if (!API_KEY) {
    console.error('❌ NASA_API_KEY is missing in EPIC route');
    return res.status(500).json({ error: 'Server misconfigured: missing NASA API key' });
  }

  const endpoint = `https://api.nasa.gov/EPIC/api/${mode}/date/${date}?api_key=${API_KEY}`;
  console.log(`🌍 Fetching EPIC data from: ${endpoint}`);

  try {
    const data = await fetchFromNASA(endpoint);

    const imgDate = date.replaceAll('-', '/');
    const results = data.map((item, i) => {
      const imageUrl = `https://epic.gsfc.nasa.gov/archive/${mode}/${imgDate}/jpg/${item.image}.jpg`;
      console.log(`🖼️ [${i + 1}] ${imageUrl}`);

      return {
        image: imageUrl,
        caption: item.caption,
        date: item.date,
        centroid_coordinates: item.centroid_coordinates,
        identifier: item.identifier,
      };
    });

    res.json(results);
  } catch (err) {
    console.error('❌ EPIC Route Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch EPIC data' });
  }
});

export default router;
