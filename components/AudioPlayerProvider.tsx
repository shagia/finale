import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { setGlobalAudioPlayer, initializeAudioMode } from '@/scripts/services/audio-service';

/**
 * AudioPlayerProvider - Initializes the global audio player instance
 * This component should be placed in the root layout to ensure the audio player
 * is available throughout the app.
 */
export default function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer();

  useEffect(() => {
    // Initialize audio mode on mount
    initializeAudioMode().catch((err) => {
      console.error('Failed to initialize audio mode:', err);
    });
    
    // Set the global player instance
    setGlobalAudioPlayer(player);
    
    return () => {
      // Cleanup: pause playback when component unmounts
      if (player.playing) {
        player.pause();
      }
    };
  }, [player]);

  // This component doesn't render anything, it just initializes the audio player
  return <>{children}</>;
}
