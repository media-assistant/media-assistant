import { ArrowLeftIcon, BookmarkIcon, PlayIcon } from "@heroicons/react/solid";
import type { Download, Movie } from "../../../lib/types";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";
import { Disclosure } from "@headlessui/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import fetcher from "../../../lib/fetcher";
import qs from "qs";
import { useRouter } from "next/router";
import useSWR from "swr";

const MovieDetail = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const tmdbId = parseInt(query.tmdbId as string);

  const { data: movie } = useSWR<Movie>(
    () => `/api/movie/${tmdbId}?${qs.stringify({ title: slug })}`,
    fetcher
  );
  const { data: download } = useSWR<Download[]>(
    () => `/api/downloads?${qs.stringify({ movieId: movie.id })}`,
    fetcher
  );

  if (!movie || !download) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>{movie.title} - Media Assistant</title>
      </Head>
      <header className="relative aspect-video w-full">
        <nav className="absolute inset-0 bottom-auto z-10 flex">
          <Link href="/">
            <a className="p-3">
              <ArrowLeftIcon className="h-6 w-6" />
            </a>
          </Link>
        </nav>
        <Image
          alt={`Thumbnail for trailer for ${movie.title}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src={movie.fanart}
        />
        <div className="bg-opacity-0.5 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.8)]">
          <a
            className="rounded-full bg-black bg-opacity-50 py-2 px-3 text-xs"
            href={`https://youtu.be/${movie.youTubeTrailerId}`}
            rel="noreferrer"
            target="_blank"
          >
            <PlayIcon className="mr-2 inline h-4 w-4" />
            <span>Trailer</span>
          </a>
        </div>
        {/* TODO: On click on the play button, swap out the image for a youtube embed.
         See https://support.google.com/youtube/answer/171780?hl=en#zippy=%2Cturn-on-privacy-enhanced-mode */}
      </header>
      <main>
        <div className="relative w-full px-4">
          <h1 className="-mt-12 text-4xl font-medium">{movie.title}</h1>
          <section>
            <h2 className="hidden">Metadata</h2>
          </section>
          <section>
            <h2 className="hidden">Overview</h2>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Panel className="" static>
                    {open ? (
                      <>
                        <p>{movie.overview}</p>
                      </>
                    ) : (
                      // TODO: Make this the height of about 3 rows of text
                      <p className="max-h-12 overflow-hidden">
                        {movie.overview}
                      </p>
                    )}
                  </Disclosure.Panel>
                  {/* TODO: Make button sort of "inline" when closed, and only appear below the content when opened */}
                  <div className="flex w-full justify-end">
                    <Disclosure.Button className="font-bold">
                      <span>{open ? "Less" : "More"}</span>
                    </Disclosure.Button>
                  </div>
                </>
              )}
            </Disclosure>
          </section>
          <section>
            <ul className="flex">
              {movie.added ? (
                <li>
                  <button className="flex flex-col items-center justify-center">
                    <BookmarkIcon className="h-5 w-5" />
                    <span className="text-xs">Watchlisted</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button className="flex flex-col items-center justify-center">
                    <BookmarkIconOutline className="h-5 w-5" />
                    <span className="text-xs">Watchlist</span>
                  </button>
                </li>
              )}
            </ul>
          </section>
          <section>
            {/* Show a banner prompting the user to add the movie to his/her watchlist if he/she hasn't yet: */}
            {!movie.added && (
              <div className="w-full rounded-xl bg-neutral-800 leading-10">
                <p className="text-lg font-medium">
                  This title is not available to watch yet
                </p>
                <p>Add it to your watchlist to download it.</p>
              </div>
            )}

            {/* Show a banner informing the user that the movie is being monitored: */}
            {movie.added && download.length === 0 && !movie.canWatch && (
              <div className="w-full rounded-xl bg-neutral-800 leading-10">
                <p className="text-lg font-medium">
                  This title is not available to watch yet
                </p>
                <p>
                  It is already on your watchlist. Once it starts downloading it
                  will show here.
                </p>
              </div>
            )}

            {/* Show a banner informing the user of the download progress: */}
            {movie.added && download.length > 0 && !movie.canWatch && (
              <div className="w-full rounded-xl bg-neutral-800 leading-10">
                <p className="text-lg font-medium">
                  This title is not available to watch yet
                </p>
                <p>
                  Its downloading progress is {download[0].progress * 100}%.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default MovieDetail;
