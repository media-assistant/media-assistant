import type { Movie } from "./types";
import qs from "qs";
import slugify from "slugify";

const apiKey = process.env.RADARR_API_KEY;
const apiUrl = `${process.env.RADARR_URL}/api/v3`;

export const getMovie = async (
  tmdbId: number,
  title?: string
): Promise<Movie | undefined> => {
  const movieParams = qs.stringify({ apiKey, tmdbId });
  const movieResponse = await fetch(`${apiUrl}/movie?${movieParams}`);

  // If Radarr responds with anything but a 200 status OK,
  // just return undefined:
  if (movieResponse.status !== 200) {
    // TODO: Proper error handling (maybe throw?)
    return undefined;
  }

  const movieList = await movieResponse.json();

  // If a response comes back that is not an empty array,
  // return the first (and only) item:
  if (movieList.length > 0) {
    return transform(movieList[0]);
  }

  // If the response is an empty list, check if a title
  // to look for was provided. If not, return undefined:
  if (!title) {
    return undefined;
  }

  // Otherwise, with the title, attempt to look up the movie:
  const lookupList = await searchMovies(title);

  // The movie we're looking for should be among the
  // search results, so look for its TMDB ID and return it
  // (returns undefined if it cannot be found):
  return lookupList.find((result) => result.tmdbId === tmdbId);
};

export const getAllMovies = async (): Promise<Movie[]> => {
  const movieParams = qs.stringify({ apiKey });
  const movieResponse = await fetch(`${apiUrl}/movie?${movieParams}`);

  // If Radarr responds with anything but a 200 status OK,
  // just return an empty list of results:
  if (movieResponse.status !== 200) return [];

  const movieList = await movieResponse.json();
  return movieList.map(transform);
};

export const getRecentMovies = async (limit: number = 10): Promise<Movie[]> => {
  const movies = await getAllMovies();
  return movies.sort((a, b) => +b.added - +a.added).slice(0, limit);
};

export const searchMovies = async (
  term: string,
  limit: number = 4
): Promise<Movie[]> => {
  // If the search query is too short, don't call the Radarr
  // API, and just return an empty lits of results:
  if (term.length < 2) return [];

  const lookupParams = qs.stringify({ apiKey, term });
  const lookupResponse = await fetch(`${apiUrl}/movie/lookup?${lookupParams}`);

  // If Radarr responds with anything but a 200 status OK,
  // just return an empty list of results:
  if (lookupResponse.status !== 200) return [];

  const movieList = await lookupResponse.json();

  return movieList.map(transform).slice(0, limit);
};

// Function to convert Radarr's API response to our own:
const transform = ({
  added,
  genres,
  hasFile,
  title,
  monitored,
  overview,
  images,
  runtime,
  year,
  youTubeTrailerId,
  id,
  tmdbId,
}): Movie => ({
  added: added === "0001-01-01T00:00:00Z" ? false : new Date(added),
  canWatch: hasFile,
  fanart: images[1]?.remoteUrl,
  genres,
  id,
  monitored,
  overview,
  poster: images[0]?.remoteUrl,
  runtime,
  slug: slugify(title, { lower: true }),
  title,
  tmdbId,
  year,
  youTubeTrailerId,
});
