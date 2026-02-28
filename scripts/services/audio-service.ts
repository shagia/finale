import { setAudioModeAsync, useAudioPlayer, AudioStatus } from 'expo-audio';

import { AUTH_URL } from '@/constants/secrets/auth-headers';
import { useGlobalAudioPlayerStatus } from '@/hooks/useGlobalAudioPlayerStatus';
import type { JellyfinItem } from '@/scripts/services/jellyfin-api';

export type AudioMetadata = {
  title?: string;
  artist?: string;
  albumTitle?: string;
  artworkUrl?: string;
};

export function jellyfinItemToAudioMetadata(item: JellyfinItem | null): AudioMetadata | undefined {
  if (!item) return undefined;
  return {
    title: item.Name,
    artist: item.AlbumArtist ?? item.Artist,
    albumTitle: item.Album,
    artworkUrl: item.AlbumId ? `${AUTH_URL}/Items/${item.AlbumId}/Images/Primary` : undefined,
  };
}

/**
 * Update the Media Session API (web) with current track metadata
 */
function setMediaSessionMetadata(metadata: AudioMetadata | undefined): void {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const session = nav && 'mediaSession' in nav ? (nav as { mediaSession: { metadata: unknown } }).mediaSession : null;
  if (!session) return;
  if (!metadata) {
    session.metadata = null;
    return;
  }
  const win = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
  const MediaMetadataCtor = win && 'MediaMetadata' in (win as object) ? (win as { MediaMetadata: new (init: { title?: string; artist?: string; album?: string; artwork?: { src: string }[] }) => unknown }).MediaMetadata : null;
  if (!MediaMetadataCtor) return;
  session.metadata = new MediaMetadataCtor({
    title: metadata.title ?? '',
    artist: metadata.artist ?? '',
    album: metadata.albumTitle ?? '',
    artwork: metadata.artworkUrl ? [{ src: metadata.artworkUrl }] : [],
  });
}

// Player type with lock screen APIs (expo-audio 1.0.15 typings may not include these)
interface LockScreenPlayer {
  setActiveForLockScreen?(active: boolean, metadata?: AudioMetadata, options?: { showSeekBackward?: boolean; showSeekForward?: boolean }): void;
  updateLockScreenMetadata?(metadata: AudioMetadata): void;
  clearLockScreenControls?(): void;
}

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

// Initialize audio mode globally. Use doNotMix for lock screen / Now Playing support per Expo docs.
export const initializeAudioMode = async () => {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionModeAndroid: 'duckOthers',
    interruptionMode: 'doNotMix',
  });
};

/**
 * Sync lock screen (native) and Media Session API (web) with the current track (single source of truth).
 * Call when currentTrack changes: pass the track to show metadata, or null to clear.
 */
export function setLockScreenTrack(track: JellyfinItem | null): void {
  const metadata = jellyfinItemToAudioMetadata(track);

  // Media Session API (web): update OS media controls / Now Playing in browser and desktop
  setMediaSessionMetadata(metadata);

  // Lock screen / Now Playing (native): expo-audio player APIs
  const player = globalPlayer as (ReturnType<typeof useAudioPlayer> & LockScreenPlayer) | null;
  if (!player) return;

  const setActive = player.setActiveForLockScreen;
  const updateMetadata = player.updateLockScreenMetadata;
  const clear = player.clearLockScreenControls;

  if (!setActive || !updateMetadata || !clear) {
    // expo-audio version may not support lock screen APIs yet
    return;
  }

  if (track && metadata) {
    setActive.call(player, true, metadata, { showSeekBackward: true, showSeekForward: true });
  } else {
    clear.call(player);
  }
}

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
    
    // On tvOS/iOS, we need to wait for the source to load before playing
    const waitForSourceReady = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const maxAttempts = 50; // 5 seconds max wait (50 * 100ms)
        let attempts = 0;
        
        const checkStatus = () => {
          attempts++;
          
          if (!globalPlayer) {
            reject(new Error('Audio player was null during source loading'));
            return;
          }
          
          // Source is ready when isLoaded is true or duration is available (> 0)
          if (globalPlayer.isLoaded || globalPlayer.duration > 0) {
            resolve();
            return;
          }
          
          if (attempts >= maxAttempts) {
            reject(new Error('Timeout waiting for audio source to load'));
            return;
          }
          
          // Check again after a short delay
          setTimeout(checkStatus, 100);
        };
        
        // Start checking immediately
        checkStatus();
      });
    };
    
    // Wait for source to be ready before playing
    await waitForSourceReady();
    
    // Play the new audio
    globalPlayer.play();
    
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