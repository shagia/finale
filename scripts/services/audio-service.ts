import { setAudioModeAsync, useAudioPlayer, AudioStatus } from 'expo-audio';

import { useGlobalAudioPlayerStatus } from '@/hooks/useGlobalAudioPlayerStatus';

// Defines the global player which is set by AudioPlayerProvider
let globalPlayer: ReturnType<typeof useAudioPlayer> | null = null;
export const setGlobalAudioPlayer = (player: ReturnType<typeof useAudioPlayer>) => {
  globalPlayer = player;
};

// Initialize audio mode globally
export const initializeAudioMode = async () => {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionModeAndroid: 'duckOthers',
    interruptionMode: 'mixWithOthers' // Review this mode, I've read that iOS doesn't consider this mode to be used as background audio (?)
  });
};

// Upon a request to play a new item or queue, this function stops the current audio, changes the source, and plays the new audio
export const requestAudioPlayback = async (url: string) => {
  try {
    if (!globalPlayer) {
      console.error('Audio player not initialized. Is AudioPlayerProvider set up in your root layout?');
      return;
    }
    
    // Pause playback if currently playing
    if (globalPlayer.playing) {
      globalPlayer.pause();
    }
    
    // Replace the source with the new URL
    globalPlayer.replace({ uri: url+'?static=true' });
    
    // Play the new audio
    await globalPlayer.play();
    
    console.log(`Playing audio from URL: ${url}`);
  } catch (error) {
    console.error('Error requesting audio playback:', error);
  }
}

export const requestAudioPause = async () => {
  try {
    if (!globalPlayer) {
      console.error('Audio player not initialized. Is AudioPlayerProvider set up in your root layout?');
      return;
    }
    
    if (globalPlayer.playing) {
      await globalPlayer.pause();
      console.log('Audio playback paused.');
    } } catch (error) {
    console.error('Error requesting audio pause:', error);
  }
}


// Export the player instance
export const getAudioPlayer = () => globalPlayer;

/**
 * Gets the current audio player status synchronously.
 * Note: This returns the current status at the time of calling, but is NOT reactive.
 * For reactive status updates in React components, use the useGlobalAudioPlayerStatus hook instead.
 * 
 * @returns The current AudioStatus object, or null if the player is not initialized.
 */

export const getAudioPlayerState = (): AudioStatus | null => {
  if (!globalPlayer) {
    return null;
  }
  return useGlobalAudioPlayerStatus(globalPlayer);
};