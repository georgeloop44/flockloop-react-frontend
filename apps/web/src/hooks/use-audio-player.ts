import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { useAudioStore } from "@flockloop/audio-state";
import type { AudioTrack } from "@flockloop/audio-state";

export function useAudioPlayer() {
  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number>(0);

  const { currentTrack, isPlaying, volume } = useAudioStore();

  // Sync time via requestAnimationFrame.
  // Keep looping while the store says isPlaying — howl.playing() may
  // lag behind during html5 buffering, so we don't gate the loop on it.
  const updateTime = useCallback(() => {
    const howl = howlRef.current;
    if (howl && howl.playing()) {
      useAudioStore.getState().setCurrentTime(howl.seek());
    }
    if (useAudioStore.getState().isPlaying) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  // Load new track when currentTrack changes
  useEffect(() => {
    if (!currentTrack) {
      howlRef.current?.unload();
      howlRef.current = null;
      cancelAnimationFrame(rafRef.current);
      return;
    }

    // Will be called with a presigned URL from the media download endpoint
    // For now, we expect audioUrl to be set externally before playing
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [currentTrack?.trackId]);

  // Play / pause sync
  useEffect(() => {
    const howl = howlRef.current;
    if (!howl) return;

    if (isPlaying) {
      howl.play();
      rafRef.current = requestAnimationFrame(updateTime);
    } else {
      howl.pause();
      cancelAnimationFrame(rafRef.current);
    }
  }, [isPlaying, updateTime]);

  // Volume sync
  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  const loadAndPlay = useCallback((track: AudioTrack, audioUrl: string) => {
    // Stop previous
    howlRef.current?.unload();
    cancelAnimationFrame(rafRef.current);

    const howl = new Howl({
      src: [audioUrl],
      html5: true,
      volume: useAudioStore.getState().volume,
      onload: () => {
        useAudioStore.getState().setDuration(howl.duration());
      },
      onplay: () => {
        // For html5 mode, duration may only be available once playback starts
        const dur = howl.duration();
        if (dur > 0) useAudioStore.getState().setDuration(dur);
        rafRef.current = requestAnimationFrame(updateTime);
      },
      onend: () => {
        useAudioStore.getState().pause();
        cancelAnimationFrame(rafRef.current);
      },
    });

    howlRef.current = howl;
    useAudioStore.getState().play(track);
    howl.play();
    rafRef.current = requestAnimationFrame(updateTime);
  }, [updateTime]);

  const seek = useCallback((time: number) => {
    const howl = howlRef.current;
    if (howl) {
      howl.seek(time);
      useAudioStore.getState().setCurrentTime(time);
    }
  }, []);

  // Cleanup on unmount — stop audio and clear the store so the player bar disappears
  useEffect(() => {
    return () => {
      howlRef.current?.unload();
      cancelAnimationFrame(rafRef.current);
      useAudioStore.getState().stop();
    };
  }, []);

  return { loadAndPlay, seek };
}
