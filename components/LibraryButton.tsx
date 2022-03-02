import { del, post } from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";
import { BookmarkIcon } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";
import IconButtonWithLabel from "@/components/IconButtonWithLabel";
import type { Movie } from "@/lib/types";
import { useRouter } from "next/router";

type LibraryButton = {
  movie: Movie;
};

const LibraryButton = ({ movie }: LibraryButton) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { inLibrary, title, tmdbId } = movie;
  const refresh = useCallback(() => {
    setIsRefreshing(true);
    router.replace(router.asPath);
  }, [router]);

  const add = useCallback(async () => {
    // Add the movie:
    await post("/api/movie", { title, tmdbId });

    // Refresh the page:
    refresh();
  }, [refresh, tmdbId, title]);

  const remove = useCallback(async () => {
    // TODO: Replace `confirm` with proper dialog
    if (confirm("Are you sure?")) {
      // Delete the movie:
      await del(`/api/movie/${tmdbId}`);

      // Refresh the page:
      refresh();
    }
  }, [refresh, tmdbId]);

  useEffect(() => {
    setIsRefreshing(false);
  }, [movie]);

  if (inLibrary) {
    return (
      <IconButtonWithLabel
        icon={BookmarkIcon}
        label={isRefreshing ? "Removing..." : "In library"}
        onClick={remove}
      />
    );
  }

  return (
    <IconButtonWithLabel
      icon={BookmarkIconOutline}
      label={isRefreshing ? "Adding..." : "Library"}
      onClick={add}
    />
  );
};

export default LibraryButton;
