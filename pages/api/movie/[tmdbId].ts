import type { NextApiRequest, NextApiResponse } from "next";
import type { Movie } from "@/lib/types";
import { deleteMovie } from "@/lib/movies";

const handler = async (req: NextApiRequest, res: NextApiResponse<Movie>) => {
  const tmdbId = parseInt(req.query.tmdbId as string);

  if (req.method === "DELETE") {
    await deleteMovie(tmdbId);
    return res.status(200).end();
  }

  return res.status(501).end();
};

export default handler;
