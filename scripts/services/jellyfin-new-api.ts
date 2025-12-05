import { Jellyfin } from '@jellyfin/sdk';

import { ApiClient, ApiClientOptions } from 'jellyfin-sdk';

export class JellyfinApi {
  private client: ApiClient;

  constructor(address: string, options?: ApiClientOptions) {
    this.client = new ApiClient({ baseUrl: address, ...options });
  }

  async serverLogin(): Promise<void> {
    // TODO: Implement server login using the Jellyfin SDK
  }

  async userLogin(username: string, password: string): Promise<void> {
    // TODO: Implement user login for authentication using the Jellyfin SDK
  }

  async getAllItems(): Promise<any[]> {
    // TODO: Implement fetching all music items using the Jellyfin SDK
    return [];
  }

  async getAlbums(): Promise<any[]> {
    // TODO: Implement fetching all albums using the Jellyfin SDK
    return [];
  }

  async getItem(itemId: string): Promise<any | null> {
    // TODO: Implement fetching a single item based on its id using the Jellyfin SDK
    return null;
  }

  async searchByTag(tag: string): Promise<any[]> {
    // TODO: Implement searching for music items based on tags using the Jellyfin SDK
    return [];
  }
}