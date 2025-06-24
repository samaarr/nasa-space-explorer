
const cachedFetch = require('./fetchWrapper');

const BASE = 'https://api.nasa.gov';
const KEY  = process.env.NASA_API_KEY;

function build(path, q = {}) {
  const qs = new URLSearchParams({ api_key: KEY, ...q }).toString();
  return `${BASE}${path}?${qs}`;
}

exports.getApod = ({ date }) =>
  cachedFetch(`apod:${date}`, build('/planetary/apod', { date }));

exports.getMars = ({ date, rover = 'curiosity' }) =>
  cachedFetch(`mars:${rover}:${date}`,
    build(`/mars-photos/api/v1/rovers/${rover}/photos`, { earth_date: date }));

exports.getNeo = ({ date, endDate }) =>
  cachedFetch(`neo:${date}:${endDate || date}`,
    build('/neo/rest/v1/feed', {
      start_date: date,
      end_date:   endDate || date,
    }));

exports.getEpic = ({ date }) =>
  cachedFetch(`epic:${date}`, build(`/EPIC/api/natural/date/${date}`));
