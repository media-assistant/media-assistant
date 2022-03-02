import type { NextApiRequest, NextApiResponse } from "next";
import type { Movie } from "@/lib/types";
import { addMovie } from "@/lib/movies";

const handler = async (req: NextApiRequest, res: NextApiResponse<Movie>) => {
  if (req.method === "POST") {
    const title = req.body.title as string;
    const tmdbId = parseInt(req.body.tmdbId as string);

    const movie = await addMovie(tmdbId, title);

    return res.status(201).json(movie);
  }

  return res.status(501).end();
};

export default handler;
