export type RadarrDownload = Record<string, unknown>;

export type Download = {
  status: "downloading"; // TODO: Can we define the different types here?
  progress: number;
};

export type RadarrMovie = {
  id: number;
  title: string;
  originalTitle?: string;
  alternateTitles?: Array<{
    sourceType: string;
    movieId: number;
    title: string;
    sourceId: number;
    votes: number;
    voteCount: number;
    language: {
      id: number;
      name: string;
    };
    id: number;
  }>;
  sortTile: string;
  sizeOnDisk: number;
  overview: string;
  inCinemas: string;
  physicalRelease: string;
  images: Array<{
    coverType: string;
    url: string;
    remoteUrl: string;
  }>;
  website: string;
  year: number;
  hasFile: boolean;
  youTubeTrailerId: string;
  studio: string;
  path: string;
  rootFolderPath: string;
  qualityProfileId: number;
  monitored: boolean;
  minimumAvailability: "released" | unknown;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  certification?: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: {
    votes: number;
    value: number;
  };
  collection: unknown;
  status: string;
};

export type Movie = {
  added: string; // Shows when the movie was added to our library. Epoch 0 if it hasn't been added yet.
  canWatch: boolean; // Shows whether there's a file present that could be played.
  certification?: string; // Certification of the movie. Example: `R`.
  fanart?: string; // URL pointing at the fan art for this movie. Optional.
  genres: string[]; // Array of three (at most) genres for this movie.
  id?: number; // ID for the movie within the Radarr database.
  inLibrary: boolean; //Shows whether the movie has been added to our library.
  monitored: boolean; // Whether the movie is monitored or not. Should be true when `added` is a date.
  overview: string; // Brief summary of the movie.
  poster?: string; // URL pointing at the poster for this movie. Optional.
  rating: number; // Rating for this movie, in percentage.
  runtime: number; // Runtime of this movie in minutes.
  runtimeString: string; // Runtime of this movie as a string. Example: `1 hr 30 min`.
  slug: string; // Slug representation of the title of this movie.
  title: string; // Full title of this movie.
  tmdbId: number; // The Movie DB id for this movie.
  year: number; // Release year of this movie.
  youTubeTrailerId?: string; // YouTube ID for the trailer for this movie. Optional.
};
