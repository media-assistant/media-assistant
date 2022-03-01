import type { Movie, RadarrMovie } from "./types";
import { del, get, post } from "@/lib/fetch";
import qs from "qs";
import slugify from "slugify";

const apiKey = process.env.RADARR_API_KEY;
const apiUrl = `${process.env.RADARR_URL}/api/v3`;

export const addMovie = async (
  tmdbId: number,
  title: string,
  qualityProfileId: number = 7,
  rootFolderPath: string = "/films"
) => {
  const params = qs.stringify({ apiKey });
  const body = {
    addOptions: {
      searchForMovie: true, // This will make Radarr immediately start searching for a download, which is what we want
    },
    qualityProfileId, // FIXME: We need to get this from the user somehow
    rootFolderPath, // FIXME: We need to get this from the user somehow
    title,
    tmdbId,
  };

  const movie = await post<RadarrMovie>(`${apiUrl}/movie?${params}`, body);

  return transform(movie);
};

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

export const getMovie = async (
  tmdbId: number,
  title?: string
): Promise<Movie | undefined> => {
  const params = qs.stringify({ apiKey, tmdbId });
  const movieList = await get<RadarrMovie[]>(`${apiUrl}/movie?${params}`);

  // If the requested movie is part of the user's library, it should be
  // the only item returned by Radarr. If that is the case, return it:
  if (movieList.length === 1 && movieList[0].tmdbId === tmdbId) {
    return transform(movieList[0]);
  }

  // If the movie is not a part of the user's library, we can look it up
  // by its title, but only if the title was provided. If it wasn't, there's
  // nothing we can do:
  if (!title) {
    // Should we throw here, just like a failed `get` will throw?
    return undefined;
  }

  // Attempt to look up the movie:
  const lookupList = await searchMovies(title);

  // The movie we're looking for should be among the
  // search results, so look for its TMDB ID:
  const movie = lookupList.find((result) => result.tmdbId === tmdbId);

  // If the movie is not within the search results, there's nothing we can do:
  if (!movie) {
    // Should we throw here, just like a failed `get` will throw?
    return undefined;
  }

  // If it was, cool! Return it:
  return movie;
};

export const getAllMovies = async (): Promise<Movie[]> => {
  const params = qs.stringify({ apiKey });
  const movieList = await get<RadarrMovie[]>(`${apiUrl}/movie?${params}`);
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

  const params = qs.stringify({ apiKey, term });
  const movieList = await get<RadarrMovie[]>(
    `${apiUrl}/movie/lookup?${params}`
  );

  return movieList.slice(0, limit).map(transform);
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
}: RadarrMovie): Movie => ({
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
