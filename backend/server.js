// This is the entry point for the backend server
// It sets up the Express server, loads environment variables, and configures routes for the NASA
// APIs including APOD, Mars Rover photos, Near-Earth Objects, and EPIC data.
// It also includes a health-check endpoint for deployment platforms like Render or Vercel.

require('dotenv').config();          // load .env first

const express = require('express');
const cors    = require('cors');

const apodRoute = require('./routes/apod');   // each one IS a router function
const marsRoute = require('./routes/mars');
const neoRoute  = require('./routes/neo');
const epicRoute = require('./routes/epic');
const neoRangeRoute = require("./routes/neoRange");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/apod', apodRoute);
app.use('/api/mars', marsRoute);
app.use('/api/neo',  neoRoute);
app.use('/api/epic', epicRoute);
app.use("/api/neo-range", neoRangeRoute);

// health-check for Render/Vercel probes
app.get('/healthz', (_, res) => res.send('OK'));

const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ No PORT env var set!");
  process.exit(1);
}

app.listen(PORT, () => console.log(`🚀  backend up on port ${PORT}`));