import { ArrowLeftIcon, HeartIcon, PlayIcon } from "@heroicons/react/solid";
import type { Download, Movie } from "@/lib/types";
import ActionsBar from "@/components/ActionsBar";
import { Disclosure } from "@headlessui/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import LibraryButton from "@/components/LibraryButton";
import Link from "next/link";
import Well from "@/components/Well";
import cn from "classnames";
import { get } from "@/lib/fetch";
import { getMovie } from "@/lib/movies";
import qs from "qs";
import useSWR from "swr";

type MovieDetail = {
  movie: Movie;
};

const MovieDetail = ({ movie }: MovieDetail) => {
  const { data: download } = useSWR<Download[]>(
    movie.id && `/api/downloads?${qs.stringify({ movieId: movie.id })}`,
    get,
    { refreshInterval: 1000 }
  );

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
          priority
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
      </header>
      <main>
        <section className="prose prose-invert relative -mt-9">
          <h1>{movie.title}</h1>
          <p className="space-x-3 text-xs">
            <span>
              <HeartIcon className="inline h-4 w-4 fill-red-400 align-bottom" />{" "}
              {movie.rating}%
            </span>
            {movie.certification && (
              <span className="rounded-md border px-3 py-1">
                {movie.certification}
              </span>
            )}
            <span>
              {movie.year} &bull; {movie.runtimeString}
            </span>
          </p>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Panel
                  className={cn({ "line-clamp-3": !open }, "overflow-hidden")}
                  static
                >
                  <p>{movie.overview}</p>
                  <p>
                    <strong>Starring</strong>
                  </p>
                  <p>
                    <strong>Directed by</strong>
                  </p>
                </Disclosure.Panel>
                <Disclosure.Button
                  className={cn(
                    "block",
                    {
                      "absolute right-0 bottom-0 bg-gradient-to-l from-neutral-900 via-neutral-900 to-transparent pl-5":
                        !open,
                    },
                    { "ml-auto": open }
                  )}
                >
                  <strong>{open ? "Less" : "More"}</strong>
                </Disclosure.Button>
              </>
            )}
          </Disclosure>
        </section>
        <ActionsBar as="section">
          <ActionsBar.Item as={LibraryButton} movie={movie} />
        </ActionsBar>
        <section>
          {/* Show a banner prompting the user to add the movie to his/her watchlist if he/she hasn't yet: */}
          {!movie.inLibrary && (
            <Well>
              <h3>This title isn&rsquo;t available to watch yet</h3>
              <p>Add it to your library to download it.</p>
            </Well>
          )}

          {/* Show a banner informing the user that the movie is being monitored: */}
          {movie.inLibrary && download?.length === 0 && !movie.canWatch && (
            <Well>
              <h3>This title isn&rsquo;t available to watch yet</h3>
              <p>
                It is being monitored for a download that matches your
                preferences.
              </p>
            </Well>
          )}

          {/* Show a banner informing the user of the download progress: */}
          {movie.inLibrary && download?.length > 0 && !movie.canWatch && (
            <Well>
              <h3>This title isn&rsquo;t available to watch yet</h3>
              <p>
                It is currently being downloaded for you (
                {Math.round(download[0].progress * 100)}%).
              </p>
            </Well>
          )}

          {/* TODO: Show a banner or another indication that this movie can be played  */}
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params.slug as string;
  const tmdbId = parseInt(params.tmdbId as string);
  const movie = await getMovie(tmdbId, slug);

  if (!movie) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      movie,
    },
  };
};

export default MovieDetail;
