import type { ApiError, Show } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getRecentShows } from "@/lib/shows";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Show[] | ApiError>
) => {
  if (req.method === "GET") {
    const limit = parseInt(req.query.limit as string);

    const shows = await getRecentShows(limit);
    return res.status(200).json(shows);
  }

  return res.status(501);
};

export default handler;
