export interface SongRequest {
  id: string;
  trackname: string;
  artist: string;
  status: "pending" | "playing" | "played";
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
  status?: "pending" | "playing" | "played";
  ispremium?: boolean;
  isarchived?: boolean;
}
