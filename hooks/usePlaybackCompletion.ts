import { useEffect, useRef } from 'react';
import { getAudioPlayer, getOnPlaybackComplete } from '@/scripts/services/audio-service';
import { useGlobalAudioPlayerStatus } from '@/hooks/useGlobalAudioPlayerStatus';

/**
 * Hook to monitor playback status and detect when a track finishes playing
 * Calls the callback set via setOnPlaybackComplete when playback completes
 */
export function usePlaybackCompletion() {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  const lastFinishedState = useRef(false);

  useEffect(() => {
    if (!status || !player) {
      return;
    }

    // Check if playback has finished
    // We check if currentTime is very close to duration (within 0.5 seconds)
    // and the player is not playing
    const isFinished = 
      status.duration > 0 &&
      status.currentTime >= status.duration - 0.5 &&
      !status.playing;

    // Reset flag when a new track starts playing (currentTime resets to near 0)
    if (status.playing && status.currentTime < 1.0 && lastFinishedState.current) {
      lastFinishedState.current = false;
      return;
    }

    // Only trigger callback once when transition from playing to finished
    if (isFinished && !lastFinishedState.current) {
      lastFinishedState.current = true;
      const callback = getOnPlaybackComplete();
      if (callback) {
        callback();
      }
    }
  }, [status, player]);
}

