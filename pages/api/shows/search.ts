import type { NextApiRequest, NextApiResponse } from "next";
import type { Show } from "@/lib/types";
import { searchShows } from "@/lib/shows";

const handler = async (req: NextApiRequest, res: NextApiResponse<Show[]>) => {
  if (req.method === "GET") {
    const query = req.query.query.toString().toLowerCase();

    const shows = await searchShows(query);
    return res.status(200).json(shows);
  }

  return res.status(501);
};

export default handler;
