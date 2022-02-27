import type { Download } from "./types";
import qs from "qs";

const apiKey = process.env.RADARR_API_KEY;
const apiUrl = `${process.env.RADARR_URL}/api/v3`;

export const getMovieQueue = async (
  movieId: number
): Promise<Download[] | undefined> => {
  const params = qs.stringify({ apiKey, movieId });
  const response = await fetch(`${apiUrl}/queue/details?${params}`);

  // If Radarr responds with anything but a 200 status OK,
  // just return an empty list of downloads:
  if (response.status !== 200) return [];

  const queue = await response.json();

  // If a response comes back that is not an empty array,
  // return the first (and only) item:
  return queue.map(transform);
};

const transform = ({ size, sizeleft }): Download => ({
  progress: 1 - sizeleft / size,
  status: "downloading",
});
