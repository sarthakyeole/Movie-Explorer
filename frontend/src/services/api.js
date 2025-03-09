const API_KEY = "d192ecfb";
const BASE_URL = "http://www.omdbapi.com/";

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}?s=popular&apikey=${API_KEY}`);
  const data = await response.json();
  return data.Search;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
  );
  const data = await response.json();
  return data.Search;
};
