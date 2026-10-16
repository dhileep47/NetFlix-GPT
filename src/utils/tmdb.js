// TMDB requests go through the Worker so the API token never reaches the browser.
const tmdb = async (path) => {
  const res = await fetch(`/api/tmdb/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
};

export default tmdb;
