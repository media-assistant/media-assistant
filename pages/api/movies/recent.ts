import type { ApiError, Movie } from "../../../lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getRecentMovies } from "../../../lib/movies";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Movie[] | ApiError>
) => {
  if (req.method === "GET") {
    const limit = parseInt(req.query.limit as string);

    const movies = await getRecentMovies(limit);
    return res.status(200).json(movies);
  }

  return res.status(501);
};

export default handler;
