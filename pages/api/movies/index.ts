import type { NextApiRequest, NextApiResponse } from "next";
import type { Movie } from "@/lib/types";
import { getAllMovies } from "@/lib/movies";

const handler = async (req: NextApiRequest, res: NextApiResponse<Movie[]>) => {
  if (req.method === "GET") {
    const movies = await getAllMovies();
    return res.status(200).json(movies);
  }

  return res.status(501);
};

export default handler;
