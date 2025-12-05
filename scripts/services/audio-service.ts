import { setAudioModeAsync, useAudioPlayer, AudioStatus } from 'expo-audio';

import { useGlobalAudioPlayerStatus } from '@/hooks/useGlobalAudioPlayerStatus';

// Defines the global player which is set by AudioPlayerProvider
let globalPlayer: ReturnType<typeof useAudioPlayer> | null = null;
export const setGlobalAudioPlayer = (player: ReturnType<typeof useAudioPlayer>) => {
  globalPlayer = player;
};

// Callback for when playback completes
let onPlaybackCompleteCallback: (() => void) | null = null;

/**
 * Set a callback to be called when the current track finishes playing
 */
export const setOnPlaybackComplete = (callback: (() => void) | null) => {
  onPlaybackCompleteCallback = callback;
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

/**
 * Get the callback for playback completion
 */
export const getOnPlaybackComplete = () => onPlaybackCompleteCallback;

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