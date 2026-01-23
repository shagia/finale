import React, { useCallback, useEffect } from 'react';
import { JellyfinItem } from '@/scripts/services/jellyfin-api';
import { requestAudioPlayback, setOnPlaybackComplete } from '@/scripts/services/audio-service';
import { useQueue } from '@/hooks/useQueue';
import { usePlaybackCompletion } from '@/hooks/usePlaybackCompletion';
import { AUTH_URL } from "@/constants/secrets/auth-headers";


interface PlaybackContextType {
  playTrack: (track: JellyfinItem) => Promise<void>;
  handlePreviousTrack: () => Promise<void>;
  handleNextTrack: () => Promise<void>;
  handlePlaybackComplete: () => Promise<void>;
  setQueueItems: (items: JellyfinItem[]) => void;
  currentTrack: JellyfinItem | null;
  hasPrevious: () => boolean;
  hasNext: () => boolean;
  queue: JellyfinItem[];
  currentIndex: number;
}

const PlaybackContext = React.createContext<PlaybackContextType | null>(null);

/**
 * PlaybackProvider - Provides global playback control functions
 * This allows any component to control playback (play, pause, next, previous)
 * without needing direct access to the queue state.
 */
export default function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const {
    advanceToNext,
    goToPrevious,
    hasPrevious,
    hasNext,
    isQueueFinished,
    setQueueItems,
    currentTrack,
    queue,
    currentIndex,
    goToTrack,
  } = useQueue();

  /**
   * Play a track from the queue

   */
  const playTrack = useCallback(async (track: JellyfinItem) => {
    if (!track) return;
    
    const trackIndex = queue.findIndex(item => item.Id === track.Id);
    if (trackIndex !== -1) {
      goToTrack(trackIndex);
    }
    
    // Play the track
    const audioUrl = `${AUTH_URL}/Audio/${track.Id}/stream.mp3`;
    await requestAudioPlayback(audioUrl);
    
    console.log(`Playing track: ${track.Name} (${track.Id})`);
  }, [queue, goToTrack]);

  /**
   * Handle playback completion - advance to next track
   */
  const handlePlaybackComplete = useCallback(async () => {
    if (isQueueFinished()) {
      console.log('Queue finished');
      return;
    }
    
    const nextTrack = advanceToNext();
    if (nextTrack) {
      await playTrack(nextTrack);
    }
  }, [isQueueFinished, advanceToNext, playTrack]);

  /**
   * Go to the previous track in the queue
   */
  const handlePreviousTrack = useCallback(async () => {
    if (!hasPrevious()) {
      console.log('No previous track available');
      return;
    }
    
    const previousTrack = goToPrevious();
    if (previousTrack) {
      await playTrack(previousTrack);
    }
  }, [hasPrevious, goToPrevious, playTrack]);

  /**
   * Go to the next track in the queue
   */
  const handleNextTrack = useCallback(async () => {
    if (!hasNext()) {
      console.log('No next track available');
      return;
    }
    
    const nextTrack = advanceToNext();
    if (nextTrack) {
      await playTrack(nextTrack);
    }
  }, [hasNext, advanceToNext, playTrack]);

  /**
   * Set up playback completion callback
   */
  useEffect(() => {
    setOnPlaybackComplete(handlePlaybackComplete);
    
    return () => {
      setOnPlaybackComplete(null);
    };
  }, [handlePlaybackComplete]);

  // Monitor playback completion to trigger callbacks
  usePlaybackCompletion();

  const value: PlaybackContextType = {
    playTrack,
    handlePreviousTrack,
    handleNextTrack,
    handlePlaybackComplete,
    setQueueItems,
    currentTrack,
    hasPrevious,
    hasNext,
    queue,
    currentIndex,
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}

/**
 * Hook to access playback control functions
 * @throws Error if used outside of PlaybackProvider
 */
export function usePlayback() {
  const context = React.useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}
