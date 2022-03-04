import type { GetServerSideProps } from "next";
import Head from "next/head";
import type { Movie } from "@/lib/types";
import Slider from "@/components/Slider";
import TitleCard from "@/components/TitleCard";
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
      <main className="space-y-8 px-6">
        <section>
          <Slider.Header as="h2">Recently added movies</Slider.Header>
          <Slider
            isEmpty={false}
            isLoading={false}
            items={movies.map(({ id, slug, title, tmdbId, poster, year }) => (
              <TitleCard
                href={`/movie/${tmdbId}/${slug}`}
                id={id}
                key={tmdbId}
                poster={poster}
                title={title}
                year={year}
              />
            ))}
            sliderKey="recent"
          />
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const movies = await getRecentMovies(20);

  return {
    props: {
      movies,
    },
  };
};

export default IndexPage;
