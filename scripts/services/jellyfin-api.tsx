import axios, { AxiosInstance } from 'axios';
import { AUTH_HEADERS } from '@/constants/secrets/auth-headers';

interface JellyfinConfig {
  baseUrl: string;
  username: string;
  password: string;
}

interface JellyfinUser {
  Id: string;
  Name: string;
  ServerId: string;
}

export interface JellyfinItem {
  Id: string;
  Name: string;
  Album: string;
  Artist?: string
  AlbumArtist?: string
  AlbumId: string;
  Type: string;
  Path?: string;
  Overview?: string;
  RunTimeTicks?: number;
  ProductionYear?: number;
  ImageTags?: {
    Primary?: string;
  };
  UserData?: {
    // TODO: I really need to check for if anything but IsFavorite is needed. This was just meant for making IsFavorite known for the ItemList component and defining it's type, but I'll see if the entire UserData object is needed.
    IsFavorite: boolean;
    ItemId: string;
    PlayCount?: number;
    Played?: boolean;
    PlayedAt?: string;
    PlayedAtTicks?: number;
  };
  BackdropImageTags?: string[];
  ThumbImageTags?: string[];
}

class JellyfinAPI {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;
  private userId: string | null = null;
  private username: string;
  private password: string;

  constructor(config: JellyfinConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': AUTH_HEADERS['Authorization'], // Utilizes an API key from constants
      },
    });
    this.username = config.username;
    this.password = config.password;
  }

  /**
   * Check if already authenticated
   */
  isAuthenticated(): boolean {
    return this.authToken !== null && this.userId !== null;
  }

  /**
   * Ensure authentication before making API calls
   * Only logs in if not already authenticated
   */
  private async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated()) {
      return;
    }
    await this.login();
  }

  /**
   * Authenticate with Jellyfin server and get an authentication token
   * Only authenticates if not already logged in
   */
  async login(): Promise<string> {
    // Return existing token if already authenticated
    if (this.isAuthenticated()) {
      return this.authToken!;
    }

    try {
      const response = await this.axiosInstance.post('/Users/AuthenticateByName', {
        Username: this.username,
        Pw: this.password,
      });

      const { AccessToken, User } = response.data;
      this.authToken = AccessToken;
      this.userId = User.Id;

      return AccessToken;
    } catch (error) {
      // TODO: Error handling could be further detailed. For example, if the currently assigned server is unreachable *after* a successful authentication, we could visualize this, and prompt the user to do a discovery search for the server again. This could be too opinionated, but something more than just an thrown error should be happening. Why not build a helper dedicated to something like this?
      throw new Error(`Failed to authenticate with Jellyfin: ${error}`);
    }
  }

  /**
   * Get a list of all users on the Jellyfin server
   */
  async getUsers(): Promise<JellyfinUser[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get('/Users', {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  /**
   * Return a specific user by ID
   */
  async returnUser(userId: string): Promise<JellyfinUser[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get(`/Users/${userId}`, {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to return user: ${error}`);
    }
  }

  /**
   * Return a specific album's items by ID
   */
  async getAllAlbumItems(itemId: string): Promise<{ Items: JellyfinItem[] }> {
    await this.ensureAuthenticated();
    try {
      // const response = await this.axiosInstance.get(`/Users/${this.userId}/Items?ParentId=${itemId}') -- commented out, maybe this endpoint isn't needed
      const response = await this.axiosInstance.get(`/Items?ParentId=${itemId}`, {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        },
        params: {
          fields: 'MediaStreams, Overview, ProductionYear, RunTimeTicks, AlbumArtist, ParentId, Name',
        }
      });
      console.log('Album Items Response:', response.data); // This is the entire response object
      // console.log('Album Items Response:', response.data.Items[0].Id); // This is the first item's ID
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch album items: ${error}`);
    }
  }

  /**
   * Get a specific item by ID
   */
  async getItem(itemId: string): Promise<JellyfinItem> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get(`/Items/${itemId}`, {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        },
        params: {
          fields: 'MediaStreams, Overview, ProductionYear, RunTimeTicks, AlbumArtist, ParentId, Name',
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch item ${itemId}: ${error}`);
    }
  }

  /**
   * Get all items from the Jellyfin library
   */
  async getAllItems(): Promise<JellyfinItem[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get('/Items', {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        },
        params: {
          UserId: this.userId,
          IncludeItemTypes: 'Movie,Series,Episode,Audio,Photo',
          Recursive: true,
        }
      });

      return response.data.Items || [];
    } catch (error) {
      throw new Error(`Failed to fetch items: ${error}`);
    }
  }

  /**
   * Mark an item as favorite for the current user.
   * Uses Jellyfin endpoint: POST /Users/{UserId}/FavoriteItems/{Id}
   */
  async markItemAsFavorite(itemId: string): Promise<void> {
    await this.ensureAuthenticated();
    if (!this.userId) throw new Error('Not authenticated');
    try {
      await this.axiosInstance.post(
        `/Users/${this.userId}/FavoriteItems/${itemId}`,
        {},
        {
          headers: {
            'Authorization': `MediaBrowser Token="${this.authToken}"`,
          },
        }
      );
    } catch (error) {
      throw new Error(`Failed to mark item as favorite: ${error}`);
    }
  }

  /**
   * Remove an item from favorites for the current user.
   * Uses Jellyfin endpoint: DELETE /Users/{UserId}/FavoriteItems/{Id}
   */
  async unmarkItemAsFavorite(itemId: string): Promise<void> {
    await this.ensureAuthenticated();
    if (!this.userId) throw new Error('Not authenticated');
    try {
      await this.axiosInstance.delete(
        `/Users/${this.userId}/FavoriteItems/${itemId}`,
        {
          headers: {
            'Authorization': `MediaBrowser Token="${this.authToken}"`,
          },
        }
      );
    } catch (error) {
      throw new Error(`Failed to remove item from favorites: ${error}`);
    }
  }

  /** Default page size for getRandomItems pagination */
  static readonly RANDOM_ITEMS_PAGE_SIZE = 50;

  /**
   * Get random items from the Jellyfin library with optional pagination.
   * @param startIndex - Index to start from (0 for first page). Use data.length for "load more".
   * @param limit - Number of items to return (default RANDOM_ITEMS_PAGE_SIZE).
   */
  async getRandomItems(startIndex = 0, limit = JellyfinAPI.RANDOM_ITEMS_PAGE_SIZE): Promise<JellyfinItem[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get('/Items', {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        },
        params: {
          UserId: this.userId,
          IncludeItemTypes: 'MusicAlbum',
          Recursive: true,
          StartIndex: startIndex,
          Limit: limit,
          SortBy: 'Random',
          fields: 'MediaStreams, Overview, ProductionYear, RunTimeTicks, AlbumArtist',
        }
      });

      return response.data.Items || [];
    } catch (error) {
      throw new Error(`Failed to fetch items: ${error}`);
    }
  }

  async getItemInfo(itemId: string): Promise<JellyfinItem[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get(`/Items/${itemId}/PlaybackInfo`, {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        },
        params: {
        }
      });

      console.log('Item Info Response:', response.data);
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch item info: ${error}`);
    }
  }

  /**
   * Get a specific item by name
   */
  async getItemByName(name: string): Promise<JellyfinItem | null> {
    try {
      const items = await this.getAllItems();
      const item = items.find((item: JellyfinItem) => item.Name === name);
      
      return item || null;
    } catch (error) {
      throw new Error(`Failed to search for item by name: ${error}`);
    }
  }

  /**
   * Get all items of a specific type
   */
  async getItemsByType(type: string): Promise<JellyfinItem[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get('/Items', {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        },
        params: {
          UserId: this.userId,
          IncludeItemTypes: type,
          Recursive: true,
        }
      });

      return response.data.Items || [];
    } catch (error) {
      throw new Error(`Failed to fetch items by type ${type}: ${error}`);
    }
  }

  /**
   * Get all audio items
   */
  async getAudio(): Promise<JellyfinItem[]> {
    return this.getItemsByType('Audio');
  }

  /**
   * Get the server information
   */
  async getServerInfo(): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get('/System/Info', {
        headers: {
          'Authorization': `MediaBrowser Token=\"${this.authToken}\"`
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch server info: ${error}`);
    }
  }

  /**
   * Logout and clear authentication
   */
  logout(): void {
    this.authToken = null;
    this.userId = null;
  }
}

// Singleton instance
let jellyfinApiInstance: JellyfinAPI | null = null;

/**
 * Get or create the singleton JellyfinAPI instance.
 * Pass config on first use (e.g. from index/explorer); later calls can omit config to get the same instance.
 */
export const getJellyfinApi = (config?: JellyfinConfig): JellyfinAPI => {
  if (!jellyfinApiInstance) {
    if (!config) {
      throw new Error('JellyfinAPI config is required for first initialization');
    }
    jellyfinApiInstance = new JellyfinAPI(config);
  }
  return jellyfinApiInstance;
};

/**
 * Return the current JellyfinAPI singleton if it exists, otherwise null.
 * Use this when you need the existing instance (e.g. for mark-as-favorite) and a parent has already called getJellyfinApi(config).
 */
export const getJellyfinApiIfExists = (): JellyfinAPI | null => jellyfinApiInstance;
export default JellyfinAPI;

