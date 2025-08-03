import { create } from "zustand";
import { Song } from "../types/songsTypes";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  volume: number;
  setSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  setQueue: (queue: Song[]) => void;
  setVolume: (volume: number) => void;
  hasUserInteracted: boolean;
  setHasUserInteracted: (val: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  volume: 1,
  setSong: (song) => set({ currentSong: song }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setQueue: (queue) => set({ queue }),
  setVolume: (volume) => set({ volume }),
  next: () => {
    const { queue, currentSong } = get();
    const currentIndex = queue.findIndex((t) => t.id === currentSong?.id);
    const nextSong = queue[currentIndex + 1];
    if (nextSong) set({ currentSong: nextSong, isPlaying: true });
  },
  prev: () => {
    const { queue, currentSong } = get();
    const currentIndex = queue.findIndex((t) => t.id === currentSong?.id);
    const prevSong = queue[currentIndex - 1];
    if (prevSong) set({ currentSong: prevSong, isPlaying: true });
  },
  hasUserInteracted: false,
  setHasUserInteracted: (val) => set({ hasUserInteracted: val }),
}));
