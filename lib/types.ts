export type ApiError = {
  error: string;
};

export type Download = {
  status: "downloading"; // TODO: Can we define the different types here?
  progress: number;
};

export type Episode = {
  overview: string;
  season: number;
  title: string;
};

export type Movie = {
  added: Date | boolean; // Shows when the movie was added to our library. False if it hasn't been added yet.
  canWatch: boolean; // Shows whether there's a file present that could be played.
  fanart?: string; // URL pointing at the fan art for this movie. Optional.
  genres: string[]; // Array of three (at most) genres for this movie.
  id: number; // ID for the movie within the Radarr database.
  monitored: boolean; // Whether the movie is monitored or not. Should be true when `added` is a date.
  overview: string; // Brief summary of the movie.
  poster?: string; // URL pointing at the poster for this movie. Optional.
  runtime: number; // Runtime of this movie in minutes.
  slug: string; // Slug representation of the title of this movie.
  title: string; // Full title of this movie.
  tmdbId: number; // The Movie DB id for this movie.
  year: number; // Release year of this movie.
  youTubeTrailerId?: string; // YouTube ID for the trailer for this movie. Optional.
};

export type Show = {
  added: Date | boolean;
  fanart?: string;
  id: number;
  overview: string;
  poster?: string;
  slug: string;
  title: string;
  tvdbId: number;
  year: number;
};
