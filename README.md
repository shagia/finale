


<p align="center">
  <img src="https://raw.githubusercontent.com/shagia/finale/refs/heads/main/public/images/readme/hero1.png" alt="Finale logo" width="100%">
</p>

Finale is an early development streamer for the Jellyfin Media Server. It's in an incredibly early state right now, and a lot of things are missing, and maybe broken.

## Getting Started with Development
<p align="center">
<img src="https://raw.githubusercontent.com/shagia/finale/ce112ab62c7afca967e793082666f6989eca756e/public/images/readme/hero4.jpg" width="100%">
</p> 

## Prerequisites
Finale is a software that utilizes the Jellyfin Media Server to exclusively play music. Requirements are:
- Any OS that has a Webview
- Xcode (for TV or iOS development)
- A local or remote Jellyfin instance, local is recommended for now
- A Jellyfin library that only contains music
- An API token from your Jellyfin instance

There is no logic handling for multiple libraries or non-Music libraries, Finale currently grabs *any* present item from your library. It's recommended to deploy a library with only music until I introduce the logic to pick libraries and skip libraries that aren't Music related.

## Constants
- `cd` into the project

- Add the following two files in `/constants/secrets`:

```ts
//  auth-headers.tsx
export const AUTH_URL = 'your-jellyfin-url';
export const AUTH_TOKEN = 'your-api-token';
export const AUTH_HEADERS = {
  'Authorization': 'MediaBrowser Client="Jellyfin%20Web", Device="Firefox", DeviceId="your-device-id", Version="10.11.2", Token="' + AUTH_TOKEN + '"',
};
```

```ts
// user-details.tsx
export const USER_AUTH = {
    username: 'your-username',
    password: 'your-password',
}
```


## Running

- For TV development:

```sh
npm install
npm prebuild:tv # Executes clean Expo prebuild with TV modifications
npm ios # Build and run for Apple TV
npm android # Build for Android TV
npm web # Run the project on web from localhost
```

- For mobile development:

```sh
npm install
npm prebuild # Executes Expo prebuild with no TV modifications
npm ios # Build and run for iOS
npm android # Build for Android mobile
npm web # Run the project on web from localhost
```

---
