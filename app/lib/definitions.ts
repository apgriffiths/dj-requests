export interface SongRequest {
  id: string;
  trackname: string;
  artist: string;
  status: "PENDING" | "PLAYING" | "PLAYED";
  date: string;
  ispremium: boolean;
  isarchived: boolean;
}

export interface CreateSongRequestInput {
  trackname: string;
  artist: string;
  ispremium?: boolean;
}

export interface UpdateSongRequestInput {
  trackname?: string;
  artist?: string;
  status?: "PENDING" | "PLAYING" | "PLAYED";
  ispremium?: boolean;
  isarchived?: boolean;
}
