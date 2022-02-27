import { useCallback, useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { Movie } from "../lib/types";
import debounce from "lodash.debounce";
import { get } from "../lib/fetcher";
import { useRouter } from "next/router";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Movie[]>([]);
  const [selectedMovie] = useState<Movie>();
  const router = useRouter();

  const fetchOptions = useCallback(
    debounce(async (query: string) => {
      const { data } = await get(`/api/movies/search?query=${query}`);
      // const { data } = await get(`/api/shows/search?query=${query}`);
      if (data) {
        setOptions(data);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchOptions(query);
  }, [fetchOptions, query]);

  return (
    <>
      <header></header>
      <main>
        <Combobox
          onChange={({ slug, tmdbId }) => {
            router.push(`/movie/${tmdbId}/${slug}`);
          }}
          value={selectedMovie}
        >
          <Combobox.Input
            autoFocus
            className="w-full bg-transparent py-2 text-inherit outline-none focus:ring-0"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Movies & TV shows"
            value={query}
          />
          <Combobox.Options>
            {options.map((movie) => {
              const { title, tmdbId } = movie;

              return (
                <Combobox.Option key={tmdbId} value={movie}>
                  {title}
                </Combobox.Option>
              );
            })}
          </Combobox.Options>
        </Combobox>
      </main>
    </>
  );
};

export default SearchPage;
