import { useState, useEffect } from "react";

const KEY = '61472b44';

export default function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(null);

        if (query.length < 3) {
          setMovies([]);
          return;
        }

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong with fetching movies");
        
        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();

    return function cleanup() {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
