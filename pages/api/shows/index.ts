import type { NextApiRequest, NextApiResponse } from "next";
import type { Show } from "@/lib/types";
import { getAllShows } from "@/lib/shows";

const handler = async (req: NextApiRequest, res: NextApiResponse<Show[]>) => {
  if (req.method === "GET") {
    const shows = await getAllShows();
    return res.status(200).json(shows);
  }

  return res.status(501);
};

export default handler;
