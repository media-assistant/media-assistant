import type { Movie, Show } from "../lib/types";
import Carousel from "../components/Carousel";
import Image from "next/image";
import fetcher from "../lib/fetcher";
import useSWR from "swr";

const IndexPage = () => {
  const { data: movies } = useSWR<Movie[]>(
    "/api/movies/recent?limit=6",
    fetcher
  );
  const { data: shows } = useSWR<Show[]>("/api/shows/recent?limit=5", fetcher);

  if (!movies || !shows) return <div>loading...</div>;

  return (
    <>
      <header></header>
      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-bold">Recently added movies</h2>
          <Carousel align="start" skipSnaps slidesToScroll={2}>
            {movies.map(({ poster, slug, title, tmdbId }) => (
              <Carousel.LinkItem href={`/movie/${tmdbId}/${slug}`} key={tmdbId}>
                <div className="relative h-full w-full">
                  <Image
                    alt={`Poster for ${title}`}
                    className="rounded-lg"
                    layout="fill"
                    src={poster}
                  />
                </div>
                <span>{title}</span>
              </Carousel.LinkItem>
            ))}
          </Carousel>
        </section>
        <section>
          <h2 className="text-xl font-bold">Recently added shows</h2>
          <Carousel align="start" skipSnaps slidesToScroll={2}>
            {shows.map(({ poster, slug, title, tvdbId }) => (
              <Carousel.LinkItem href={`/show/${tvdbId}/${slug}`} key={tvdbId}>
                <div className="relative h-full w-full">
                  <Image
                    alt={`Poster for ${title}`}
                    className="rounded-lg"
                    layout="fill"
                    src={poster}
                  />
                </div>
                <span>{title}</span>
              </Carousel.LinkItem>
            ))}
          </Carousel>
        </section>
      </main>
    </>
  );
};

export default IndexPage;
