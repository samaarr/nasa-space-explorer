// backend/utils/fetchWrapper.js
import fetch from 'node-fetch';

export async function fetchFromNASA(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[NASA Fetch Error]', err.message);
    throw err;
  }
}
