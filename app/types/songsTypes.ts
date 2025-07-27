export interface Song {
  id: string;
  title: string;
  artist: string | null;
  album_id: string | null;
  duration: number | null;
  audio_url: string;
  cover_url: string | null;
  created_at: string;
  liked: boolean;
}

export interface Album {
  songs: Song[];
  id: string;
  title: string;
  artist: string | null;
  cover_url: string | null;
  year: number | null;
  genre: string | null;
  created_at: string;
}

