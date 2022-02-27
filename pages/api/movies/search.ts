import type { NextApiRequest, NextApiResponse } from "next";
import type { Movie } from "../../../lib/types";
import { searchMovies } from "../../../lib/movies";

const handler = async (req: NextApiRequest, res: NextApiResponse<Movie[]>) => {
  if (req.method === "GET") {
    const query = req.query.query.toString().toLowerCase();

    const movies = await searchMovies(query);
    return res.status(200).json(movies);
  }

  return res.status(501);
};

export default handler;
