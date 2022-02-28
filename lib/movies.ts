import type { Movie } from "./types";
import qs from "qs";
import slugify from "slugify";

const apiKey = process.env.RADARR_API_KEY;
const apiUrl = `${process.env.RADARR_URL}/api/v3`;

export const addMovie = async (tmdbId: number, title: string) => {
  const params = qs.stringify({ apiKey });
  const body = {
    addOptions: {
      searchForMovie: true, // This will make Radarr immediately start searching for a download, which is what we want
    },
    qualityProfileId: 7, // FIXME: We need to get this from the user somehow
    rootFolderPath: "/films", // FIXME: We need to get this from the user somehow
    title,
    tmdbId,
  };
  const response = await fetch(`${apiUrl}/movie?${params}`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (response.status !== 201) {
    // TODO: Proper error handling
    return undefined;
  }

  const movie = await response.json();
  return transform(movie);
};

export const deleteMovie = async (tmdbId: number) => {
  const movie = await getMovie(tmdbId);

  // TODO: Handle edge cases such as the movie being undefined

  const params = qs.stringify({ apiKey });
  const response = await fetch(`${apiUrl}/movie/${movie.id}?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  // TODO: Handle the repsonse
};

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
  certification,
  genres,
  hasFile,
  title,
  monitored,
  overview,
  images,
  ratings,
  runtime,
  year,
  youTubeTrailerId,
  id,
  tmdbId,
}): Movie => ({
  added: added === "0001-01-01T00:00:00Z" ? false : new Date(added),
  canWatch: hasFile,
  certification,
  fanart: images[1]?.remoteUrl,
  genres,
  id,
  monitored,
  overview,
  poster: images[0]?.remoteUrl,
  rating: ratings.value * 10,
  runtime,
  runtimeString: `${Math.floor(runtime / 60)} hr ${runtime % 60} min`,
  slug: slugify(title, { lower: true }),
  title,
  tmdbId,
  year,
  youTubeTrailerId,
});
