import type { ApiError, Show } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getShow } from "@/lib/shows";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Show | ApiError>
) => {
  if (req.method === "GET") {
    const tvdbId = parseInt(req.query.tvdbId as string);
    const title = req.query.title as string;

    const show = await getShow(tvdbId, title);

    if (show) return res.status(200).json(show);
    return res.status(404).json({ error: "Not Found" });
  }

  if (req.method === "POST") {
    // TODO: Figure out how to add a show so that Sonarr will
    // have the download client download it.
  }

  return res.status(501);
};

export default handler;
