import type { Movie, Show } from "../lib/types";
import Image from "next/image";
import Link from "next/link";
import fetcher from "../lib/fetcher";
import useEmblaCarousel from "embla-carousel-react";
import useSWR from "swr";

const IndexPage = () => {
  const { data: movies } = useSWR<Movie[]>(
    "/api/movies/recent?limit=5",
    fetcher
  );
  const { data: shows } = useSWR<Show[]>("/api/shows/recent?limit=5", fetcher);

  const [emblaRef] = useEmblaCarousel({ align: "start" });

  if (!movies || !shows) return <div>loading...</div>;

  return (
    <>
      <header></header>
      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-bold">Recently added movies</h2>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {movies.map(({ poster, slug, title, tmdbId }) => (
                <Link href={`/movie/${tmdbId}/${slug}`} key={tmdbId} passHref>
                  <a className="relative flex-shrink-0 flex-grow-0">
                    <div className="relative mr-6 mb-2 aspect-[2/3] w-36">
                      <Image
                        alt={`Poster for ${title}`}
                        className="rounded-lg"
                        layout="fill"
                        src={poster}
                      />
                    </div>
                    <span>{title}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold">Recently added shows</h2>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {shows.map(({ poster, slug, title, tvdbId }) => (
                <Link href={`/show/${tvdbId}/${slug}`} key={tvdbId} passHref>
                  <a className="relative flex-shrink-0 flex-grow-0">
                    <div className="relative mr-6 mb-2 aspect-[2/3] w-36">
                      <Image
                        alt={`Poster for ${title}`}
                        className="rounded-lg"
                        layout="fill"
                        src={poster}
                      />
                    </div>
                    <span>{title}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default IndexPage;
