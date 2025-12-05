# Finale

![Finale logo](/public/images/logo-hero.jpg "Finale logo")

Finale is an early development streamer for the Jellyfin Media Server. It's in an incredibly early state right now, and a lot of things are missing, and maybe broken.

## 🚀 How to use

- `cd` into the project

- Make the folder in `/constants/secrets` and add the two following files:

```ts
//  auth-headers.tsx
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

- For TV development:

```sh
npm
npm prebuild:tv # Executes clean Expo prebuild with TV modifications
npm ios # Build and run for Apple TV
npm android # Build for Android TV
npm web # Run the project on web from localhost
```

- For mobile development:

```sh
npm
npm prebuild # Executes Expo prebuild with no TV modifications
npm ios # Build and run for iOS
npm android # Build for Android mobile
npm web # Run the project on web from localhost
```
