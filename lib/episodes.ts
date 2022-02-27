import type { Episode } from "./types";
import qs from "qs";

const apiKey = process.env.SONARR_API_KEY;
const apiUrl = `${process.env.SONARR_URL}/api`;

export const getEpisodes = async (seriesId: number): Promise<Episode[]> => {
  const episodeParams = qs.stringify({ apiKey, seriesId });
  const episodeResponse = await fetch(`${apiUrl}/episode?${episodeParams}`);

  // If Sonarr responds with anything but a 200 status OK,
  // just return an empty list of results:
  if (episodeResponse.status !== 200) return [];

  const episodeList = await episodeResponse.json();

  return episodeList.map(transform);
};

// Function to convert Sonarr's API response to our own:
const transform = ({ overview, seasonNumber, title }): Episode => ({
  overview,
  season: seasonNumber,
  title,
});
