import { useAudioPlayerStatus, AudioStatus, useAudioPlayer } from 'expo-audio';
import { getAudioPlayer } from '@/scripts/services/audio-service';
import { useMemo } from 'react';

/**
 * Custom hook that provides the status of the global audio player.
 * This hook uses useAudioPlayerStatus internally to provide reactive status updates.
 * 
 * @param player - The audio player instance (or null). If null, will attempt to get from service.
 * @returns The current AudioStatus object, or null if the player is not initialized.
 * 
 * @example
 * ```tsx
 * import { useGlobalAudioPlayerStatus } from '@/hooks/useGlobalAudioPlayerStatus';
 * import { getAudioPlayer } from '@/scripts/services/audio-service';
 * 
 * function MyComponent() {
 *   const player = getAudioPlayer();
 *   const status = useGlobalAudioPlayerStatus(player);
 *   
 *   if (!status) {
 *     return <Text>No audio player available</Text>;
 *   }
 *   
 *   return (
 *     <View>
 *       <Text>Playing: {status.playing ? 'Yes' : 'No'}</Text>
 *       <Text>Current Time: {status.currentTime}s</Text>
 *       <Text>Duration: {status.duration}s</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useGlobalAudioPlayerStatus (player: ReturnType<typeof useAudioPlayer> | null): AudioStatus | null {
  // Get the actual player to use - either the provided one or from service
  const actualPlayer = useMemo(() => {
    return player || getAudioPlayer();
  }, [player]);
  
  // CRITICAL: We must always call useAudioPlayerStatus unconditionally to follow Rules of Hooks.
  // Since useAudioPlayerStatus doesn't accept null, we need to ensure we always have a valid player.
  // We'll create a temporary player using useAudioPlayer if needed, but prefer the actual player.
  const fallbackPlayer = useAudioPlayer();
  
  // Determine which player to use - prefer actualPlayer, fall back to fallbackPlayer
  const playerToUse = actualPlayer || fallbackPlayer;
  
  // Always call the hook unconditionally - this is required by Rules of Hooks
  const status = useAudioPlayerStatus(playerToUse);
  
  // Only return status if we're using the actual player (not the fallback)
  // This ensures we only return real status when we have the real player
  return actualPlayer ? status : null;
}