import type { NextApiRequest, NextApiResponse } from "next";
import { addMovie, deleteMovie } from "@/lib/movies";
import type { Movie } from "@/lib/types";

const handler = async (req: NextApiRequest, res: NextApiResponse<Movie>) => {
  const tmdbId = parseInt(req.query.tmdbId as string);
  const title = (req.query.title as string).toLowerCase();

  if (req.method === "DELETE") {
    await deleteMovie(tmdbId);
    return res.status(200);
  }

  if (req.method === "POST") {
    const movie = await addMovie(tmdbId, title);
    return res.status(201).json(movie);
  }

  return res.status(501);
};

export default handler;
