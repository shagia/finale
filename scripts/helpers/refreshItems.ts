import type { JellyfinItem } from "@/scripts/services/jellyfin-api";

export interface RefreshItemsApi {
  getRandomItems(startIndex?: number, limit?: number): Promise<JellyfinItem[]>;
}

export interface RefreshItemsCallbacks {
  setData: (data: JellyfinItem[] | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface LoadMoreCallbacks {
  setData: (updater: (prev: JellyfinItem[] | null) => JellyfinItem[] | null) => void;
  setLoadingMore: (loading: boolean) => void;
}

/** Page size for "load more" requests; should match API default. */
export const ITEMS_PAGE_SIZE = 50;

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
    const apiData = await api.getRandomItems(0, ITEMS_PAGE_SIZE);
    setData(apiData);
    return apiData;
  } catch (error) {
    console.error("Error fetching data from Jellyfin:", error);
  } finally {
    setLoading(false);
  }
}

/**
 * Fetches the next page of items and appends to existing data.
 * Use when user scrolls to the end of the list (FlatList onEndReached or ScrollView near bottom).
 * @param api - Same API instance used for initial load
 * @param startIndex - Current data length (offset for next page)
 * @param callbacks - setData (state setter) and setLoadingMore
 * @returns New items if successful; length < ITEMS_PAGE_SIZE means no more pages.
 */
export async function loadMoreItems(
  api: RefreshItemsApi,
  startIndex: number,
  { setData, setLoadingMore }: LoadMoreCallbacks,
): Promise<JellyfinItem[] | undefined> {
  try {
    setLoadingMore(true);
    const nextItems = await api.getRandomItems(startIndex, ITEMS_PAGE_SIZE);
    setData((prev) => (prev ? [...prev, ...nextItems] : nextItems));
    return nextItems;
  } catch (error) {
    console.error("Error loading more items from Jellyfin:", error);
  } finally {
    setLoadingMore(false);
  }
}
