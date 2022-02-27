import type { ApiError, Movie } from "../../../lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getMovie } from "../../../lib/movies";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Movie | ApiError>
) => {
  if (req.method === "GET") {
    const tmdbId = parseInt(req.query.tmdbId as string);
    const title = (req.query.title as string).toLowerCase();

    const movie = await getMovie(tmdbId, title);

    if (movie) return res.status(200).json(movie);
    return res.status(404).json({ error: "Not Found" });
  }

  if (req.method === "POST") {
    // TODO: Figure out how to add a movie so that Radarr will
    // have the download client download it.
  }

  return res.status(501);
};

export default handler;
