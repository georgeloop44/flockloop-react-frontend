import { create } from "zustand";

export interface AudioTrack {
  trackId: string;
  title: string;
  artist: string;
  thumbnailUrl: string | null;
  mediaId: string;
}

interface AudioState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

interface AudioActions {
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
}

// Callbacks for playlist navigation — set by the page that owns the track list
let onSkipNext: (() => void) | null = null;
let onSkipPrevious: (() => void) | null = null;

export function setSkipCallbacks(next: () => void, previous: () => void) {
  onSkipNext = next;
  onSkipPrevious = previous;
}

export const useAudioStore = create<AudioState & AudioActions>()((set) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  play: (track) =>
    set({ currentTrack: track, isPlaying: true, currentTime: 0, duration: 0 }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  stop: () =>
    set({ currentTrack: null, isPlaying: false, currentTime: 0, duration: 0 }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume }),

  skipNext: () => {
    onSkipNext?.();
  },

  skipPrevious: () => {
    onSkipPrevious?.();
  },
}));
