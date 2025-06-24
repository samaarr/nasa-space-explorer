import dotenv from 'dotenv';
dotenv.config(); // must come before everything else

console.log('🧪 Load NASA_API_KEY:', !!process.env.NASA_API_KEY);

import express from 'express';
import cors from 'cors';

import apodRoute from './routes/apod.js';
import marsRoute from './routes/mars.js';
import neoRoute from './routes/neo.js';
import epicRoute from './routes/epic.js';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/apod', apodRoute);
app.use('/api/mars', marsRoute);
app.use('/api/neo', neoRoute);
app.use('/api/epic', epicRoute);

app.get('/', (req, res) => {
  res.send('🌌 NASA API backend is running.');
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
