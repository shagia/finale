import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Drawer } from "react-native-drawer-layout";
import { useEffect } from "react";
import { Platform, Pressable, Text, TouchableOpacity, Image, View } from "react-native";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import PlaybackProvider from "@/components/PlaybackProvider";
import DrawerProvider, { useDrawer } from "@/components/DrawerProvider";
import FocusedItemProvider from "@/components/FocusedItemProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";

// Disable reanimated warnings, may not be useful. I got it from the template project
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function DrawerContent() {
  const router = useRouter();
  const { open, openDrawer, closeDrawer } = useDrawer();
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
    <Drawer
      open={open}
      onOpen={openDrawer}
      onClose={closeDrawer}
      keyboardDismissMode="none"
      drawerStyle={{
        backgroundColor: "#171717",
        borderRightWidth: 1,
        borderRightColor: "#454545",
      }}
      renderDrawerContent={() => {
        return (
          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 40,
              flex: 1,
              flexDirection: "column",
              gap: 10,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <View>
                <Image
                  source={require("../assets/images/finale-logo.svg")}
                  style={{ width: "100%", height: 30, resizeMode: "contain" }}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#3C3C3C", fontFamily: "SpaceMono" }}>build 0.0-null</Text>
                <Text style={{ color: "#3C3C3C", fontFamily: "SpaceMono" }}>{Platform ? Platform.OS + " " + Platform.Version : "Unknown"}</Text>
              </View>
            </View>
            <Pressable
              style={({ hovered }) => ({
                backgroundColor: hovered ? "#2a2a2a" : "#171717",
                padding: 5,
              })}
              onPress={() => {
                router.navigate("/");
                closeDrawer();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SpaceMono",
                  fontSize: 30,
                }}
              >
                Home
              </Text>
            </Pressable>
            <Pressable
              style={({ hovered }) => ({
                backgroundColor: hovered ? "#2a2a2a" : "#171717",
                padding: 5,
              })}
              onPress={() => {
                router.navigate("/(tabs)/playing");
                closeDrawer();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SpaceMono",
                  fontSize: 30,
                }}
              >
                Now Playing
              </Text>
            </Pressable>
            <Pressable
              style={({ hovered }) => ({
                backgroundColor: hovered ? "#2a2a2a" : "#171717",
                padding: 5,
              })}
              onPress={() => {
                           router.navigate("/(tabs)/explorer");
     closeDrawer();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SpaceMono",
                  fontSize: 30,
                }}
              >
                Explorer
              </Text>
            </Pressable>
          </View>
        );
      }}
    >
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#171717" },
        }}
      >
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/playing" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/explorer" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/test" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MenuProvider>
          <AudioPlayerProvider>
            <PlaybackProvider>
              <FocusedItemProvider>
                <DrawerProvider>
                  <DrawerContent />
                </DrawerProvider>
              </FocusedItemProvider>
            </PlaybackProvider>
          </AudioPlayerProvider>
        </MenuProvider>
      </GestureHandlerRootView>
    </>
  );
}
