import { getJellyfinApi } from '../services/jellyfin-api';

/**
 * Get the overview text for any item by its ID
 * Returns the overview string or a default message if not available
 * 
 * @param itemId - The ID of the item to get the overview for
 * @returns A promise that resolves to the overview string
 */
export const getItemOverview = async (
  itemId: string
): Promise<string> => {
  try {
    const jellyfinApi = getJellyfinApi();
    const item = await jellyfinApi.getItem(itemId);
    // console.log("Item Overview in getItemOverview: " + item.Id + item.Name + " with Overview: " + item.Overview);
    return (
      item.Overview ||
      `No overview is available for ${item.Name}. Fill out the overview for ${item.Name} in the Jellyfin web interface to see it here.`
    );
  } catch (error) {
    console.error(`Error fetching overview for item ${itemId}:`, error);
    return "No overview available for " + itemId;
  }
};
