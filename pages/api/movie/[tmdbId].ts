import type { ApiError, Movie } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { addMovie, deleteMovie, getMovie } from "@/lib/movies";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Movie | ApiError>
) => {
  const tmdbId = parseInt(req.query.tmdbId as string);
  const title = (req.query.title as string).toLowerCase();

  if (req.method === "DELETE") {
    await deleteMovie(tmdbId);
    return res.status(200);
  }

  if (req.method === "GET") {
    const movie = await getMovie(tmdbId, title);

    if (movie) return res.status(200).json(movie);
    return res.status(404).json({ error: "Not Found" });
  }

  if (req.method === "POST") {
    const movie = await addMovie(tmdbId, title);
    return res.status(201).json(movie);
  }

  return res.status(501);
};

export default handler;
