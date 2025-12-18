import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Text, View } from "react-native";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import PlaybackProvider from "@/components/PlaybackProvider";

// Disable reanimated warnings, may not be useful. I got it from the template project
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/ibm-plex-mono/IBMPlexMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <>
      <AudioPlayerProvider>
        <PlaybackProvider>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "#171717" },
            }}
          >
            <Stack.Screen
              name="(tabs)/home"
            />
            <Stack.Screen
              name="(tabs)/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(tabs)/playing"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)/test" options={{ headerShown: true }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PlaybackProvider>
      </AudioPlayerProvider>
    </>
  );
}
