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

<div align="center">Finale is an in-development, self-hosted music player designed for large screens with an album-first focus on information display utilizing the Jellyfin Media System, and built with React Native and Expo.</div>

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>

<table style="">
<tr>
<td><img src="https://raw.githubusercontent.com/shagia/finale/refs/heads/main/public/images/readme/screenshots/Explorer%20Page%20demo.png" alt="Finale Explorer"><p align="center">Finale Explorer</p></td>
<td><img src="https://raw.githubusercontent.com/shagia/finale/refs/heads/main/public/images/readme/screenshots/Home%20Page%20demo.png" alt="Home Page"><p align="center">Home Page</p></td>
</tr>
</table>

### ⚠️ Note on usability

<div align="">Finale is in a very basic stage. Many basic quality of life features are simply not implemented yet. In this state, it's encouraged that it's used solely for developmental and testing purposes. For those interested in contributing, reviewing Finale's most sought-after features is a helpful starting point.</div>

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

### Shoutouts

<hr style="border: none; height: 4px; background-color:rgb(88, 88, 88); margin: 20px 0 20px 0;"></hr>
Finale is bit of a 'passion' project with the intent of being an accessible program to the public. It must be said that there were inspirations that I got from these programs and people:

#### Feishin

<p style="padding-bottom: 10px">
<img src="https://raw.githubusercontent.com/jeffvli/feishin/refs/heads/development/assets/icons/icon.png" style="padding: 0 15px 10px 0; float:left" width="100px"></img>
One of my most used and favorite streamers, and maybe the one that inspired me to design my own just for fun. Really Spotify-esque in functionality and look, nice for if you're looking for a self-hosted streamer that supports more than Jellyfin, but Navidrome *and* the OpenSubsonic API.</p>

#### Finamp (and James Harvey's documentation on the Jellyfin API)

<p style="padding-bottom: 10px">
<img src="https://raw.githubusercontent.com/UnicornsOnLSD/finamp/refs/heads/main/images/finamp.png" style="padding: 0 15px 10px 0; float:left" width="100px"></img>
Jellyfin is a dense, confusing place with big, wonderful outcomes. It's a deeply detailed system, and that detail is shared in the API to a great degree. With no experience, having a crash course with the API only led to so much until I found that James had an awesome post about his own hard work done with the API to build Finamp, a real cream-of-the-crop player on iOS and Android.

If you'd like to explore the API, his article is what kicked it all off for me. Check it out:
https://jmshrv.com/posts/jellyfin-api/

</p>

<br>
<br>
