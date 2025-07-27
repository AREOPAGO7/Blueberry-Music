import { supabase } from '@/lib/supabase';

export interface Song {
  liked: any;
  id: string;
  title: string;
  artist: string | null;
  album_id: string | null;
  duration: number | null;
  audio_url: string;
  cover_url: string | null;
  created_at: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string | null;
  cover_url: string | null;
  year: number | null;
  genre: string | null;
  created_at: string;
}

export interface SongWithAlbum extends Song {
  album: Album | null;
}

export interface AlbumWithSongs extends Album {
  songs: Song[];
}

/**
 * Get all albums with their songs
 * @returns Promise<AlbumWithSongs[]> - Array of albums with their songs
 */
export async function getAllAlbumsWithSongs(): Promise<AlbumWithSongs[]> {
  try {
    // First get all albums
    const { data: albums, error: albumsError } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: true });

    if (albumsError) {
      console.error('Error fetching albums:', albumsError);
      throw new Error(albumsError.message);
    }

    if (!albums || albums.length === 0) {
      return [];
    }

    // Get all songs
    const { data: allSongs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: true });

    if (songsError) {
      console.error('Error fetching songs:', songsError);
      throw new Error(songsError.message);
    }

    // Group songs by album_id
    const songsByAlbum = new Map<string, Song[]>();
    allSongs?.forEach(song => {
      if (song.album_id) {
        if (!songsByAlbum.has(song.album_id)) {
          songsByAlbum.set(song.album_id, []);
        }
        songsByAlbum.get(song.album_id)!.push(song);
      }
    });

    // Combine albums with their songs
    const albumsWithSongs: AlbumWithSongs[] = albums.map(album => ({
      ...album,
      songs: songsByAlbum.get(album.id) || []
    }));

    return albumsWithSongs;
  } catch (error) {
    console.error('Error in getAllAlbumsWithSongs:', error);
    throw error;
  }
}

/**
 * Get all songs by album ID
 * @param albumId - The UUID of the album
 * @returns Promise<Song[]> - Array of songs in the album
 */
export async function getSongsByAlbum(albumId: string): Promise<Song[]> {
  try {
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching songs by album:', error);
      throw new Error(error.message);
    }

    return songs || [];
  } catch (error) {
    console.error('Error in getSongsByAlbum:', error);
    throw error;
  }
}

/**
 * Get an album with all its songs
 * @param albumId - The UUID of the album
 * @returns Promise<AlbumWithSongs | null> - The album with songs or null if not found
 */
export async function getAlbumWithSongs(albumId: string): Promise<AlbumWithSongs | null> {
  try {
    // First get the album
    const { data: album, error: albumError } = await supabase
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single();

    if (albumError) {
      if (albumError.code === 'PGRST116') {
        // No rows returned (album not found)
        return null;
      }
      console.error('Error fetching album:', albumError);
      throw new Error(albumError.message);
    }

    // Then get all songs for this album
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .eq('album_id', albumId)
      .order('order', { ascending: true });

    if (songsError) {
      console.error('Error fetching songs for album:', songsError);
      throw new Error(songsError.message);
    }

    // Combine album with songs
    return {
      ...album,
      songs: songs || []
    };
  } catch (error) {
    console.error('Error in getAlbumWithSongs:', error);
    throw error;
  }
}

export async function getSongById(songId: string): Promise<Song | null> {
  try {
    const { data: song, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', songId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (song not found)
        return null;
      }
      console.error('Error fetching song by ID:', error);
      throw new Error(error.message);
    }

    return song;
  } catch (error) {
    console.error('Error in getSongById:', error);
    throw error;
  }
}

/**
 * Get a song with its album information
 * @param songId - The UUID of the song
 * @returns Promise<SongWithAlbum | null> - The song with album info or null if not found
 */
export async function getSongWithAlbum(songId: string): Promise<SongWithAlbum | null> {
  try {
    const { data: song, error } = await supabase
      .from('songs')
      .select(`
        *,
        album:albums(*)
      `)
      .eq('id', songId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (song not found)
        return null;
      }
      console.error('Error fetching song with album:', error);
      throw new Error(error.message);
    }

    return song;
  } catch (error) {
    console.error('Error in getSongWithAlbum:', error);
    throw error;
  }
}

/**
 * Get all songs with their album information
 * @returns Promise<SongWithAlbum[]> - Array of songs with album info
 */
export async function getAllSongsWithAlbums(): Promise<SongWithAlbum[]> {
  try {
    const { data: songs, error } = await supabase
      .from('songs')
      .select(`
        *,
        album:albums(*)
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching all songs with albums:', error);
      throw new Error(error.message);
    }

    return songs || [];
  } catch (error) {
    console.error('Error in getAllSongsWithAlbums:', error);
    throw error;
  }
}

/**
 * Search songs by title or artist
 * @param query - Search query
 * @returns Promise<Song[]> - Array of matching songs
 */
export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error searching songs:', error);
      throw new Error(error.message);
    }

    return songs || [];
  } catch (error) {
    console.error('Error in searchSongs:', error);
    throw error;
  }
}
