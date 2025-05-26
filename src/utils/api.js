import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
  Authorization: "Bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 400);

  try {
    const response = await axios.get(BASE_URL + url, {
      headers,
      params,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.data;
  } catch (err) {
    clearTimeout(timeout);

    console.warn("API failed or timed out:", err.message);
    const isMovieDetails = /^\/movie\/\d+$/.test(url);
    const isTvDetails = /^\/tv\/\d+$/.test(url);

    // extract ID
    const id = url.split("/").pop();

    if (isMovieDetails || isTvDetails) {
      const fallbackFiles = [
        "/mocks/trending-movie-day.json",
        "/mocks/trending-movie-week.json",
        "/mocks/movie-popular.json",
        "/mocks/tv-popular.json",
        "movie-top_rated.json",
        "tv-top_rated.json",
        "/mocks/discover-movie.json",
        "/mocks/discover-tv.json"
      ];

      for (let file of fallbackFiles) {
        try {
          const response = await fetch(file);
          const data = await response.json();

          const match = data.results?.find((item) => item.id == id);
          if (match) {
            console.log(`Found mock item in ${file}`);
            return match;
          }
        } catch (e) {
          console.warn(`Failed to search ${file}:`, e.message);
        }
      }

      throw new Error("No matching item found in mock files");
    }

    // default fallback for non-dynamic endpoints
    const mockFileName = url.replace(/\//g, "-").replace(/^-/, "") + ".json";

    try {
      const response = await fetch(`/mocks/${mockFileName}`);
      const mockData = await response.json();
      localStorage.setItem('fallbackData', 'true')
      return mockData;
    } catch (mockErr) {
      console.error("Failed to load fallback:", mockErr);
      throw mockErr;
    }
  }
};

export const fetchDataFromAltApi = async (query) => {
  const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      const transformedResults = data.Search.map((item) => ({
        id: item.imdbID,
        title: item.Title,
        name: item.Title, // fallback for components using 'name'
        poster_path: item.Poster !== "N/A" ? item.Poster : null,
        release_date: item.Year,
        media_type: item.Type, // 'movie' or 'series'
      }));

      return {
        results: transformedResults,
        total_results: parseInt(data.totalResults, 10),
        total_pages: 1,
      };
    } else {
      return {
        results: [],
        total_results: 0,
        total_pages: 0,
      };
    }
  } catch (error) {
    console.error("OMDb fallback failed:", error);
    return {
      results: [],
      total_results: 0,
      total_pages: 0,
    };
  }
};
