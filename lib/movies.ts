import type { Movie, RadarrMovie } from "./types";
import { del, get, post } from "@/lib/fetch";
import qs from "qs";
import slugify from "slugify";

const apiKey = process.env.RADARR_API_KEY;
const apiUrl = `${process.env.RADARR_URL}/api/v3`;

const qualityProfileId = parseInt(process.env.RADARR_QUALITY_PROFILE);
const rootFolderPath = process.env.RADARR_FOLDER;

/**
 * Adds the specfied movie to the user's Radarr library.
 *
 * @param tmdbId The Movie DB ID for the movie to add
 * @param title The title of this movie
 * @returns The added movie
 *
 */
export const addMovie = async (tmdbId: number, title: string) => {
  const params = qs.stringify({ apiKey });
  const body = {
    addOptions: {
      searchForMovie: true,
    },
    qualityProfileId,
    rootFolderPath,
    title,
    tmdbId,
  };

  const movie = await post<RadarrMovie>(`${apiUrl}/movie?${params}`, body);

  return transform(movie);
};

/**
 * Removes the specfied movie to the user's Radarr library.
 *
 * @param tmdbId The The Movie DB ID for the movie to add
 *
 */
export const deleteMovie = async (tmdbId: number) => {
  // First, get the movie because we don't know its Radarr id:
  const movie = await getMovie(tmdbId);

  // If the movie could not be found, silently fail as if it was
  // properly deleted:
  if (!movie) return;

  // Next, delete it:
  const params = qs.stringify({ apiKey });
  await del(`${apiUrl}/movie/${movie.id}?${params}`);
};

/**
 * Finds and returns a specific movie. Looks within the user's Radarr library first,
 * and falls back to Radarr's lookup API if the title is provided.
 *
 * @param tmdbId The The Movie DB ID for the movie to find
 * @param [title] The title of the movie to find
 * @returns The movie, if found, otherwise undefined
 *
 */
export const getMovie = async (tmdbId: number): Promise<Movie | undefined> => {
  const params = qs.stringify({ apiKey, term: `tmdb:${tmdbId}` });
  const movie = await get<RadarrMovie[]>(`${apiUrl}/movie/lookup?${params}`);

  return transform(movie[0]);
};

/**
 * Finds and returns all movies in the user's Radarr library.
 *
 * @returns An array of movies
 *
 */
export const getAllMovies = async (): Promise<Movie[]> => {
  const params = qs.stringify({ apiKey });
  const movieList = await get<RadarrMovie[]>(`${apiUrl}/movie?${params}`);

  return movieList.map((movie) => transform(movie));
};

/**
 * Finds and returns a subset of movies in the user's Radarr library,
 * sorted by when they were added to the library.
 *
 * @param [limit] The amount of movies to return
 * @returns An array of movies
 *
 */
export const getRecentMovies = async (limit: number = 10): Promise<Movie[]> => {
  const movies = await getAllMovies();
  return movies
    .sort((a, b) => +Date.parse(b.added) - +Date.parse(a.added))
    .slice(0, limit);
};

/**
 * Wrapper around Radarr's lookup API.
 *
 * @param term The search query to use
 * @param [limit] The amount of movies to return
 * @returns An array of movies
 *
 */
export const searchMovies = async (
  term: string,
  limit: number = 4
): Promise<Movie[]> => {
  // If the search query is too short, don't call the Radarr
  // API, and just return an empty lits of results:
  if (term.length < 2) return [];

  const params = qs.stringify({ apiKey, term });
  const movieList = await get<RadarrMovie[]>(
    `${apiUrl}/movie/lookup?${params}`
  );

  return movieList.slice(0, limit).map((movie) => transform(movie));
};

// Function to convert Radarr's API response to our own:
const transform = ({
  added,
  certification,
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
}: RadarrMovie): Movie => ({
  added,
  canWatch: hasFile,
  ...(certification && { certification }),
  fanart: images[1]?.remoteUrl,
  genres,
  ...(id && { id }),
  inLibrary: Date.parse(added) > 0,
  monitored,
  overview,
  poster: images[0]?.remoteUrl,
  runtime,
  runtimeString: `${Math.floor(runtime / 60)} hr ${runtime % 60} min`,
  slug: slugify(title, { lower: true, strict: true }),
  title,
  tmdbId,
  year,
  youTubeTrailerId,
});
