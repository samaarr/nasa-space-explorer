import express from 'express';
import { fetchFromNASA } from '../utils/fetchWrapper.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const inputDate = req.query.date || new Date().toISOString().split('T')[0];
  const API_KEY = process.env.NASA_API_KEY;

  console.log('🧪 Apod NASA_API_KEY:', !!API_KEY);

  const buildUrl = (date) =>
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;

  const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

  const tryFetch = async (date) => {
    const url = buildUrl(date);
    console.log('🔭 Fetching from:', url);
    return await fetchFromNASA(url);
  };

  try {
    const data = await tryFetch(inputDate);
    res.json(data);
  } catch (err) {
    console.warn(`⚠️ Failed for ${inputDate}, retrying with previous day...`);

    // Try the previous day
    const fallbackDateObj = new Date(inputDate);
    fallbackDateObj.setDate(fallbackDateObj.getDate() - 1);
    const fallbackDate = formatDate(fallbackDateObj);

    try {
      const fallbackData = await tryFetch(fallbackDate);
      res.json(fallbackData);
    } catch (fallbackErr) {
      console.error('❌ Both primary and fallback APOD fetch failed:', fallbackErr.message);
      res.status(500).json({ error: 'Failed to fetch APOD data for both dates' });
    }
  }
});

export default router;
