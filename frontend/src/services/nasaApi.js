import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

export const fetchApod = async (date) => {
  const res = await axios.get(`${BASE_URL}/apod`, { params: { date } });
  return res.data;
};

export async function fetchEpicRangeImages(centerDate, mode = 'natural') {
  const getDateString = (offsetDays) => {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0];
  };

  const dates = [-1, 0, 1].map(getDateString);
  const allImages = [];

  for (const date of dates) {
    try {
      const res = await axios.get(`${BASE_URL}/epic`, {
        params: { date, mode },
      });
      console.log(`🛰️ Images loaded for ${date}: ${res.data.length}`);
      allImages.push(...res.data.map((img) => ({ ...img, originalDate: date })));
    } catch (err) {
      console.error(`❌ Error loading EPIC images for ${date}:`, err.message);
    }
  }

  return allImages;
}



export async function fetchMarsPhotos(date = '2020-07-01', rover = 'curiosity', camera = '') {
  try {
    const res = await axios.get(`${BASE_URL}/mars`, {
      params: { date, rover, camera },
    });
    return res.data;
  } catch (err) {
    console.error('❌ Mars API error:', err.message);
    return [];
  }
}

export async function fetchNeoData(startDate, endDate = startDate) {
  try {
    const response = await axios.get(`${BASE_URL}/neo`, {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
  } catch (error) {
    console.error('🚨 Error fetching NEO data:', error);
    throw error;
  }
}
