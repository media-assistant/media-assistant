import type { Download, RadarrDownload } from "./types";
import { get } from "@/lib/fetch";
import qs from "qs";

const apiKey = process.env.RADARR_API_KEY;
const apiUrl = `${process.env.RADARR_URL}/api/v3`;

export const getMovieQueue = async (
  movieId: number
): Promise<Download[] | undefined> => {
  const params = qs.stringify({ apiKey, movieId });
  const queue = await get<RadarrDownload[]>(
    `${apiUrl}/queue/details?${params}`
  );

  // If a response comes back that is not an empty array,
  // return the first (and only) item:
  return queue.map(transform);
};

const transform = ({ size, sizeleft }: RadarrDownload): Download => ({
  // @ts-expect-error TODO: remove this line after properly typing RadarrDownload
  progress: 1 - sizeleft / size,
  status: "downloading",
});
