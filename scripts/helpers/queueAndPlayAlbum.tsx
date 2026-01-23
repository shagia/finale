import { JellyfinItem } from '../services/jellyfin-api';
import JellyfinAPI from '../services/jellyfin-api';

/**
 * Queue all tracks from an album and play the first track
 * 
 * @param albumId - The ID of the album to queue
 * @param albumName - The name of the album (for logging)
 * @param jellyfinApi - The Jellyfin API instance
 * @param setQueueItems - Function to set the queue items
 * @param playTrack - Function to play a track
 * @returns A promise that resolves to the album items when the album is queued and playback starts
 */
export const queueAndPlayAlbum = async (
  albumId: string,
  albumName: string,
  jellyfinApi: JellyfinAPI,
  setQueueItems: (items: JellyfinItem[]) => void,
  playTrack: (track: JellyfinItem) => Promise<void>
): Promise<JellyfinItem[]> => {
  try {
    console.log(`Queuing Album: ${albumName} with ID: ${albumId}`);
    const albumItems = await jellyfinApi.getAllAlbumItems(albumId);
    console.log("Album Items:", albumItems);

    // Create queue from all album items
    setQueueItems(albumItems.Items);

    // Play the first track in the queue
    if (albumItems.Items.length > 0) {
      await playTrack(albumItems.Items[0]);
    }

    return albumItems.Items;
  } catch (error) {
    console.error(`Error queueing and playing album ${albumName} (${albumId}):`, error);
    throw error;
  }
};
