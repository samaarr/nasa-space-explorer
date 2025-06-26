// This is the entry point for the backend server
// It sets up the Express server, loads environment variables, and configures routes for the NASA
// APIs including APOD, Mars Rover photos, Near-Earth Objects, and EPIC data.
// It also includes a health-check endpoint for deployment platforms like Render or Vercel.

require('dotenv').config();          

const express = require('express');
const cors    = require('cors');

const apodRoute = require('./routes/apod');   
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

// Health-check endpoint for deployment platforms
app.get('/healthz', (_, res) => res.send('OK'));

const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ No PORT env var set!");
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: monospace; padding: 2rem;">
      <h1>✅ NASA Explorer Backend Running</h1>
      <p>You're seeing this because the server is up and ready.</p>
    </div>
  `);
});

app.listen(PORT, () => console.log(`🚀  backend up on port ${PORT}`));