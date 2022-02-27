import type { NextApiRequest, NextApiResponse } from "next";
import { Download } from "../../lib/types";
import { getMovieQueue } from "../../lib/downloads";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Download[]>
) => {
  const movieId = parseInt(req.query.movieId as string);

  const download = await getMovieQueue(movieId);

  return res.status(200).json(download);
};

export default handler;
