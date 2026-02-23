import { create } from "zustand";

export interface AudioTrack {
  trackId: string;
  title: string;
  artist: string;
  thumbnailUrl: string | null;
  mediaId: string;
}

interface AudioCallbacks {
  onLoadAndPlay: ((track: AudioTrack, url: string) => void) | null;
  onSeek: ((time: number) => void) | null;
  onSkipNext: (() => void) | null;
  onSkipPrevious: (() => void) | null;
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

export const useAudioStore = create<
  AudioState & AudioActions & AudioCallbacks
>()((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  // Callbacks — managed in the store so they're cleaned up properly
  onLoadAndPlay: null,
  onSeek: null,
  onSkipNext: null,
  onSkipPrevious: null,

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
    get().onSkipNext?.();
  },

  skipPrevious: () => {
    get().onSkipPrevious?.();
  },
}));

/** Register skip callbacks. Call from pages that own the track list. */
export function setSkipCallbacks(next: () => void, previous: () => void) {
  useAudioStore.setState({ onSkipNext: next, onSkipPrevious: previous });
}

/**
 * Register audio player callbacks. Call once from the persistent layout (AppShell).
 * Returns a cleanup function that nulls the callbacks.
 */
export function setAudioPlayerCallbacks(callbacks: {
  loadAndPlay: (track: AudioTrack, url: string) => void;
  seek: (time: number) => void;
}) {
  useAudioStore.setState({
    onLoadAndPlay: callbacks.loadAndPlay,
    onSeek: callbacks.seek,
  });
  return () => {
    useAudioStore.setState({ onLoadAndPlay: null, onSeek: null });
  };
}

/** Load a track and start playback. Call from any page. */
export function audioLoadAndPlay(track: AudioTrack, url: string) {
  useAudioStore.getState().onLoadAndPlay?.(track, url);
}

/** Seek to a specific time (seconds). Call from any component. */
export function audioSeek(time: number) {
  useAudioStore.getState().onSeek?.(time);
}
