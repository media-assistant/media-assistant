import type { NextApiRequest, NextApiResponse } from "next";
import { Episode } from "@/lib/types";
import { getEpisodes } from "@/lib/episodes";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Episode[]>
) => {
  const showId = parseInt(req.query.showId as string);

  const episodes = await getEpisodes(showId);

  return res.status(200).json(episodes);
};

export default handler;
