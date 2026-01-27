import { useState, useCallback } from 'react';
import { JellyfinItem } from '@/scripts/services/jellyfin-api';

interface QueueState {
  items: JellyfinItem[];
  currentIndex: number;
}

/**
 * Custom hook to manage the audio playback queue
 * Stores an array of JellyfinItem objects and tracks the current playing index
 */
export function useQueue() {
  const [queue, setQueue] = useState<QueueState>({
    items: [],
    currentIndex: -1,
  });

  /**
   * Replace the current queue with a new set of items
   * Resets the current index to 0 (first item)
   */
  const setQueueItems = useCallback((items: JellyfinItem[]) => {
    setQueue({
      items,
      currentIndex: items.length > 0 ? 0 : -1,
    });
  }, []);

  /**
   * Update queue items while preserving the current index
   * Useful for updating item properties (like favorite status) without resetting playback position
   */
  const updateQueueItems = useCallback((updater: (items: JellyfinItem[]) => JellyfinItem[]) => {
    setQueue((prev) => {
      const newItems = updater(prev.items);
      return {
        items: newItems,
        // Preserves currentIndex only if it's shrunk out of bounds after an update
        currentIndex: prev.currentIndex >= newItems.length 
          ? Math.max(0, newItems.length - 1)
          : prev.currentIndex,
      };
    });
  }, []);

  /**
   * Get the current track being played
   */
  const getCurrentTrack = useCallback((): JellyfinItem | null => {
    if (queue.currentIndex >= 0 && queue.currentIndex < queue.items.length) {
      return queue.items[queue.currentIndex];
    }
    return null;
  }, [queue]);

  /**
   * Get the previous track in the queue
   */
  const getPreviousTrack = useCallback((): JellyfinItem | null => {
    const prevIndex = queue.currentIndex - 1;
    if (prevIndex >= 0 && prevIndex < queue.items.length) {
      return queue.items[prevIndex];
    }
    return null;
  }, [queue]);

  /**
   * Get the next track in the queue
   */
  const getNextTrack = useCallback((): JellyfinItem | null => {
    const nextIndex = queue.currentIndex + 1;
    if (nextIndex < queue.items.length) {
      return queue.items[nextIndex];
    }
    return null;
  }, [queue]);

  /**
   * Check if there is a previous track available
   */
  const hasPrevious = useCallback((): boolean => {
    return queue.currentIndex > 0;
  }, [queue]);

  /**
   * Check if there is a next track available
   */
  const hasNext = useCallback((): boolean => {
    return queue.currentIndex < queue.items.length - 1;
  }, [queue]);

  /**
   * Go to the previous track in the queue
   * Returns the previous track or null if at the beginning
   */
  const goToPrevious = useCallback((): JellyfinItem | null => {
    const prevIndex = queue.currentIndex - 1;
    if (prevIndex >= 0) {
      setQueue((prev) => ({
        ...prev,
        currentIndex: prevIndex,
      }));
      return queue.items[prevIndex];
    }
    return null;
  }, [queue]);

  /**
   * Advance to the next track in the queue
   * Returns the next track or null if queue is finished
   */
  const advanceToNext = useCallback((): JellyfinItem | null => {
    const nextIndex = queue.currentIndex + 1;
    if (nextIndex < queue.items.length) {
      setQueue((prev) => ({
        ...prev,
        currentIndex: nextIndex,
      }));
      return queue.items[nextIndex];
    }
    return null;
  }, [queue]);

  /**
   * Go to a specific track by index
   * Returns the track or null if index is invalid
   */
  const goToTrack = useCallback((index: number): JellyfinItem | null => {
    if (index >= 0 && index < queue.items.length) {
      setQueue((prev) => ({
        ...prev,
        currentIndex: index,
      }));
      return queue.items[index];
    }
    return null;
  }, [queue]);

  /**
   * Check if the queue has finished playing
   */
  const isQueueFinished = useCallback((): boolean => {
    return queue.currentIndex >= queue.items.length - 1;
  }, [queue]);

  /**
   * Check if the queue is empty
   */
  const isEmpty = useCallback((): boolean => {
    return queue.items.length === 0;
  }, [queue]);

  /**
   * Get the total number of items in the queue
   */
  const getQueueLength = useCallback((): number => {
    return queue.items.length;
  }, [queue]);

  return {
    queue: queue.items,
    currentIndex: queue.currentIndex,
    currentTrack: getCurrentTrack(),
    previousTrack: getPreviousTrack(),
    nextTrack: getNextTrack(),
    hasPrevious,
    hasNext,
    setQueueItems,
    updateQueueItems,
    goToPrevious,
    advanceToNext,
    goToTrack,
    isQueueFinished,
    isEmpty,
    getQueueLength,
  };
}

