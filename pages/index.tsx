import Carousel from "@/components/Carousel";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import type { Movie } from "@/lib/types";
import { getRecentMovies } from "@/lib/movies";

type IndexPage = {
  movies: Movie[];
};

const IndexPage = ({ movies }: IndexPage) => {
  return (
    <>
      <Head>
        <title>Media Assistant</title>
      </Head>
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
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const movies = await getRecentMovies(6);

  return {
    props: {
      movies,
    },
  };
};

export default IndexPage;
