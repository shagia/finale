import { useAudioPlayerStatus, AudioStatus, useAudioPlayer } from 'expo-audio';
import { getAudioPlayer } from '@/scripts/services/audio-service';

/**
 * Custom hook that provides the status of the global audio player.
 * This hook uses useAudioPlayerStatus internally to provide reactive status updates.
 * 
 * @returns The current AudioStatus object, or null if the player is not initialized.
 * 
 * @example
 * ```tsx
 * import { useGlobalAudioPlayerStatus } from '@/hooks/useGlobalAudioPlayerStatus';
 * 
 * function MyComponent() {
 *   const status = useGlobalAudioPlayerStatus();
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
export function useGlobalAudioPlayerStatus (player: ReturnType<typeof useAudioPlayer>): AudioStatus | null {

  
  if (!player) {
    return null;
  }
  
  return useAudioPlayerStatus(player);
}