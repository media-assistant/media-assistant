import type { Show } from "./types";
import qs from "qs";
import slugify from "slugify";

const apiKey = process.env.SONARR_API_KEY;
const apiUrl = `${process.env.SONARR_URL}/api`;

export const getShow = async (
  tvdbId: number,
  title?: string
): Promise<Show | undefined> => {
  const showParams = qs.stringify({ apiKey });
  const showResponse = await fetch(`${apiUrl}/series?${showParams}`);

  // If Sonarr responds with anything but a 200 status OK,
  // just return undefined:
  if (showResponse.status !== 200) {
    // TODO: Proper error handling (maybe throw?)
    return undefined;
  }

  const showsList = await showResponse.json();

  // We need to check if our show is in the list returned
  // by Sonarr (since there's no endpoint to just get a single
  // show by TVDB ID):
  const show = showsList.find((result) => result.tvdbId === tvdbId);

  // If it is, return it:
  if (show) return transform(show);

  // If the response is an empty list, check if a title
  // to look for was provided. If not, return undefined:
  if (!title) {
    return undefined;
  }

  // Otherwise, with the title, attempt to look up the movie:
  const lookupList = await searchShows(title);

  // The movie we're looking for should be among the
  // search results, so look for its TMDB ID and return it
  // (returns undefined if it cannot be found):
  return lookupList.find((result) => result.tvdbId === tvdbId);
};

export const getAllShows = async (): Promise<Show[]> => {
  const showParams = qs.stringify({ apiKey });
  const showResponse = await fetch(`${apiUrl}/series?${showParams}`);

  // If Sonarr responds with anything but a 200 status OK,
  // just return an empty list of results:
  if (showResponse.status !== 200) return [];

  const showList = await showResponse.json();
  return showList.map(transform);
};

export const getRecentShows = async (limit: number = 10): Promise<Show[]> => {
  const shows = await getAllShows();
  return shows.sort((a, b) => +b.added - +a.added).slice(0, limit);
};

export const searchShows = async (
  term: string,
  limit: number = 4
): Promise<Show[]> => {
  // If the search query is too short, don't call the Sonarr
  // API, and just return an empty lits of results:
  if (term.length < 2) return [];

  const lookupParams = qs.stringify({ apiKey, term });
  const lookupResponse = await fetch(`${apiUrl}/series/lookup?${lookupParams}`);

  // If Sonarr responds with anything but a 200 status OK,
  // just return an empty list of results:
  if (lookupResponse.status !== 200) return [];

  const showsList = await lookupResponse.json();

  return showsList.map(transform).slice(0, limit);
};

// Function to convert Sonarr's API response to our own:
const transform = ({
  added,
  id,
  images,
  overview,
  title,
  tvdbId,
  year,
}): Show => ({
  added: added === "0001-01-01T00:00:00Z" ? false : new Date(added),
  fanart: images[2]?.remoteUrl,
  id,
  overview,
  poster: images[1]?.remoteUrl,
  slug: slugify(title, { lower: true }),
  title,
  tvdbId,
  year,
});
