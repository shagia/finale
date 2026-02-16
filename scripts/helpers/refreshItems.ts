import type { JellyfinItem } from "@/scripts/services/jellyfin-api";

export interface RefreshItemsApi {
  getRandomItems(): Promise<JellyfinItem[]>;
}

export interface RefreshItemsCallbacks {
  setData: (data: JellyfinItem[] | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Fetches items from Jellyfin, updates data and loading state.
 * Use for both initial load and manual refresh (e.g. header menu or refresh button).
 */
export async function refreshItems(
  api: RefreshItemsApi,
  { setData, setLoading }: RefreshItemsCallbacks,
): Promise<JellyfinItem[] | undefined> {
  try {
    setLoading(true);
    // TODO: The method of fetching will need to be defined by a user choice
    const apiData = await api.getRandomItems();
    setData(apiData);
    return apiData;
  } catch (error) {
    console.error("Error fetching data from Jellyfin:", error);
  } finally {
    setLoading(false);
  }
}
