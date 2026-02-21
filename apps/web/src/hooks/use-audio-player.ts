import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { useAudioStore, setAudioPlayerCallbacks } from "@flockloop/audio-state";
import type { AudioTrack } from "@flockloop/audio-state";

/**
 * Manages Howler.js playback. Must be called exactly once in a persistent
 * layout (AppShell) so audio survives page navigation. Pages interact with
 * audio via the store actions (audioLoadAndPlay, audioSeek) exported from
 * @flockloop/audio-state.
 */
export function useAudioPlayer() {
  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number>(0);

  const { currentTrack, isPlaying, volume } = useAudioStore();

  // Sync time via requestAnimationFrame
  const updateTime = useCallback(() => {
    const howl = howlRef.current;
    if (howl && howl.playing()) {
      useAudioStore.getState().setCurrentTime(howl.seek());
    }
    if (useAudioStore.getState().isPlaying) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  // Cleanup when currentTrack is cleared externally (e.g. stop())
  useEffect(() => {
    if (!currentTrack) {
      howlRef.current?.unload();
      howlRef.current = null;
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [currentTrack?.trackId ?? null]);

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

  const loadAndPlay = useCallback(
    (track: AudioTrack, audioUrl: string) => {
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
    },
    [updateTime],
  );

  const seek = useCallback((time: number) => {
    const howl = howlRef.current;
    if (howl) {
      howl.seek(time);
      useAudioStore.getState().setCurrentTime(time);
    }
  }, []);

  // Register loadAndPlay/seek so any page can use them via audioLoadAndPlay/audioSeek
  useEffect(() => {
    return setAudioPlayerCallbacks({ loadAndPlay, seek });
  }, [loadAndPlay, seek]);
}
