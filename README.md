<p align="center">
  <img src="https://raw.githubusercontent.com/shagia/finale/refs/heads/main/public/images/readme/hero1.png" alt="Finale logo" width="100%">
</p>

<div style="padding-bottom:10px" align="center">
🎶 
<span style="padding-right:15px"></span>
Listening in Large
<span style="padding-right:15px"></span>
 🎶
<br>
<br>

<img src="https://img.shields.io/github/license/shagia/finale?style=plastic&color=%232B2B2B">
<span style="padding-right:10px"></span>
<img src="https://img.shields.io/github/commit-activity/m/shagia/finale?style=plastic&color=%232B2B2B">
</div>

<div align="center">Finale is an in-development, self-hosted music player designed for large screens with a focus on information display utilizing the Jellyfin Media System, and built with React Native and Expo.</div>

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>

<table style="">
<tr>
<td><img src="https://raw.githubusercontent.com/shagia/finale/refs/heads/main/public/images/readme/screenshots/Explorer%20Page%20demo.png" alt="Finale Explorer"><p align="center">Finale Explorer</p></td>
<td><img src="https://raw.githubusercontent.com/shagia/finale/refs/heads/main/public/images/readme/screenshots/Home%20Page%20demo.png" alt="Home Page"><p align="center">Home Page</p></td>
</tr>
</table>

### ⚠️ Note on usability

<div align="">Finale is in a very basic stage. Many basic quality of life features are simply not implemented yet. In this state, it's encouraged that it's used solely for developmental and testing purposes.</div>

### Getting Started with Development

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>

<p align="center">
<img src="https://raw.githubusercontent.com/shagia/finale/ce112ab62c7afca967e793082666f6989eca756e/public/images/readme/hero4.jpg" width="100%">
</p>

### Prerequisites

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>

Finale is a software that utilizes the Jellyfin Media Server to exclusively play music. Requirements are:

- Any OS that has a Webview
- Xcode (for TV or iOS development)
- A local or remote Jellyfin instance, local is recommended for now
- A Jellyfin library that only contains music
- An API token from your Jellyfin instance

There is no logic handling for multiple libraries or non-Music libraries, Finale currently grabs _any_ present item from your library. It's recommended to deploy a library with only music until I introduce the logic to pick libraries and skip libraries that aren't Music related.

### Constants

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>

- `cd` into the project
- Add the following two files in`/constants/secrets`:

```ts
//  auth-headers.tsx
export const AUTH_URL = "your-jellyfin-url";
export const AUTH_TOKEN = "your-api-token";
export const AUTH_HEADERS = {
  Authorization:
    'MediaBrowser Client="Jellyfin%20Web", Device="Firefox", DeviceId="your-device-id", Version="10.11.2", Token="' +
    AUTH_TOKEN +
    '"',
};
```

```ts
// user-details.tsx
export const USER_AUTH = {
  username: "your-username",
  password: "your-password",
};
```

### Running

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>

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
