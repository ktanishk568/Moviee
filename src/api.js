// OMDB API — free key (1000 requests/day).
// Get your own free key at: https://www.omdbapi.com/apikey.aspx
const API_KEY = 'b9bd48a6';
const BASE_URL = 'https://www.omdbapi.com';

export async function searchTitles(query, type = '') {
  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    ...(type && { type }),
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'No results found');
  return data.Search;
}

export async function getDetails(imdbId) {
  const params = new URLSearchParams({
    apikey: API_KEY,
    i: imdbId,
    plot: 'full',
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Details not found');
  return data;
}
