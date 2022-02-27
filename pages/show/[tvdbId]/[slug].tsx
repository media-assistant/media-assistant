import { ArrowLeftIcon, BookmarkIcon } from "@heroicons/react/solid";
import type { Episode, Show } from "../../../lib/types";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";
import { Disclosure } from "@headlessui/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import fetcher from "../../../lib/fetcher";
import qs from "qs";
import { useRouter } from "next/router";
import useSWR from "swr";

const ShowDetail = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const tvdbId = parseInt(query.tvdbId as string);

  const { data: show } = useSWR<Show>(
    () => `/api/show/${tvdbId}?${qs.stringify({ title: slug })}`,
    fetcher
  );
  const { data: episodes } = useSWR<Episode[]>(
    () => `/api/episodes?${qs.stringify({ showId: show.id })}`,
    fetcher
  );

  if (!show || !episodes) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>{show.title} - Media Assistant</title>
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
          alt={`Thumbnail for trailer for ${show.title}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src={show.fanart}
        />
        <div className="bg-opacity-0.5 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.8)]"></div>
      </header>
      <main>
        <div className="relative w-full px-4">
          <h1 className="-mt-12 text-4xl font-medium">{show.title}</h1>
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
                        <p>{show.overview}</p>
                      </>
                    ) : (
                      // TODO: Make this the height of about 3 rows of text
                      <p className="max-h-12 overflow-hidden">
                        {show.overview}
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
              {show.added ? (
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
          <section></section>
        </div>
      </main>
    </>
  );
};

export default ShowDetail;
