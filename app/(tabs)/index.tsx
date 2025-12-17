import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import JellyfinAPI, { JellyfinItem } from "@/scripts/services/jellyfin-api";
import { USER_AUTH } from "@/constants/secrets/user-details";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import MarqueeText from "@/components/MarqueeText";
import { FocusedItemWidget } from "@/components/widgets/focusedItemWidget";
import { NowPlayingWidget } from "@/components/widgets/nowPlayingWidget";
import { AlbumOverviewWidget } from "@/components/widgets/albumOverviewWidget";
import { usePlayback } from "@/components/PlaybackProvider";

export default function Index() {
  const [publicURL, setPublicURL] = useState<string | null>(null);
  const [data, setData] = useState<JellyfinItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusedItem, setFocusedItem] = useState<JellyfinItem | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<JellyfinItem | null>(null);
  const [itemOverview, setItemOverview] = useState<string | null>(null);

  // Playback control functions from context
  const { playTrack, setQueueItems, currentTrack } = usePlayback();

  const createTwoButtonAlert = () =>
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  const jellyfinApi = new JellyfinAPI({
    baseUrl: AUTH_URL,
    username: USER_AUTH.username,
    password: USER_AUTH.password,
    // ! DO NOT USE THESE CREDENTIALS IN PRODUCTION, replace with a constants file that's ignored !
  });

  /* const getMediaInfo = async (itemId: string) => {
    try {
      const apiData = await jellyfinApi.getItemInfo(itemId);
      console.log("Media Info:", apiData);
      return apiData;
    } catch (error) {
      console.error("Error fetching media info from Jellyfin:", error);
    }
  } */ // Might just remove this, wrote it early and I think ItemInfo gets what I need for now

  /**
   * Get the overview text for any item by its ID
   * Returns the overview string or a default message if not available
   */
  const getItemOverview = async (itemId: string): Promise<string> => {
    try {
      const item = await jellyfinApi.getItem(itemId);
      console.log("Item Overview in getItemOverview: " + item.Id + item.Name);
      return (
        item.Overview ||
        `No overview is available for ${item.Name}. Fill out the overview for ${item.Name} in the Jellyfin web interface to see it here.`
      );
    } catch (error) {
      console.error(`Error fetching overview for item ${itemId}:`, error);
      return "No overview available for " + itemId;
    }
  };

  const fetchData = async () => {
    try {
      // No need to call login() - getRandomItems() will ensure authentication automatically
      const apiData = await jellyfinApi.getRandomItems();
      console.log("Jellyfin Data:", apiData);
      setData(apiData);
      return apiData;
    } catch (error) {
      console.error("Error fetching data from Jellyfin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Update metadata when current track changes
   */
  useEffect(() => {
    if (currentTrack) {
      setAudioMetadata(currentTrack);
      // Update overview when track changes
      getItemOverview(currentTrack.AlbumId).then(setItemOverview);
    }
  }, [currentTrack]);
  const router = useRouter();
  return (
    <>
      <View
        style={{
          backgroundColor: "#171717",
          paddingTop: 20,
          paddingBottom: 15,
          paddingLeft: 140,
          paddingRight: 140,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.navigate("/test")}>
          <Image
            source={require("../../assets/images/finale-logo.png")}
            style={{ width: 200, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: "#9c9c9cff",
            fontFamily: "SpaceMono",
          }}
        >
          Explorer View
        </Text>
      </View>
      <View
        style={{
          borderBottomColor: "#454545",
          borderBottomWidth: 2,
        }}
      />
      <ScrollView
        focusable={true}
        hasTVPreferredFocus
        nestedScrollEnabled={Platform.isTV}
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{
          gap: 20,
          paddingTop: 50,
          backgroundColor: "#171717",
        }}
      >
        {data?.map((item) => (
          // So many things wrong here
          // Really lazy way of playing **the first** item, and quickly changing it when you press a new item
          // AND its a static URL. No transcoding support and that's not what I want
          // FIXED: There's no handling on the player for stopping/pausing/changing tracks properly. When you rehydrate the player with a new URL, the old player doesn't even stop, but you have two audio streams playing simultaneously instead.
          // In a productive environement, we want an entire album to be queued and played in order
          // Worth reviewing the Finamp codebase to see how they handle this
          // In the meantime, it should be time to convert this to a method or a component
          <Pressable
            onPress={async () => {
              const albumItems = await jellyfinApi.getAllAlbumItems(item.Id);
              console.log(`Pressed Album: ${item.Name} with ID: ${item.Id}`);
              console.log("Album Items:", albumItems);

              // Create queue from all album items
              setQueueItems(albumItems.Items);

              // Play the first track in the queue
              if (albumItems.Items.length > 0) {
                await playTrack(albumItems.Items[0]);
              }

              Alert.alert(
                "Item Pressed",
                `You pressed on ${item.Name}, ${item.Id}. Queue created with ${albumItems.Items.length} tracks.`
              );
            }}
            onLongPress={() => {
              console.log(`Long Pressed ${item.Name}`);
            }}
            onFocus={() => {
              console.log(`Focused on ${item.Name}`);
              setFocusedItem(item);
              // getMediaInfo(item.Id)
            }}
            onBlur={() => {
              console.log(`Blurred ${item.Name}`);
              // Not the same as hovering out. You hovering out implies you're no longer focused on any item at all, Blurring out implies you're focused on the next item. Nulling for blurring would break the flow of focus.
            }}
            onHoverIn={() => {
              console.log(`Hovered on ${item.Name}`);
              setFocusedItem(item);
            }}
            onHoverOut={() => {
              console.log(`Hovered out of ${item.Name}`);
              setFocusedItem(null);
            }}
            style={[
              {
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 5,
                paddingBottom: 10,
              },
              focusedItem?.Id === item.Id && {
                backgroundColor: "Pink",
                transform: [{ scale: 1.05 }],
              },
            ]}
            key={item.Id}
          >
            <View
              key={item.Id}
              style={[
                {
                  paddingTop: 5,
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingBottom: 30,
                },
                focusedItem?.Id === item.Id && { backgroundColor: "lightgray" },
              ]}
            >
              <Image
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: 5,
                }}
                source={{
                  uri: `${AUTH_URL}/Items/${item.Id}/Images/Primary`, // Replace with base URL variable
                }}
              />
              <View style={{ paddingTop: 10 }}>
                <MarqueeText
                  text={item.AlbumArtist || "Unknown Artist"}
                  isFocused={focusedItem?.Id === item.Id}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: focusedItem?.Id === item.Id ? "black" : "#ffffffff",
                  }}
                />
                <MarqueeText
                  text={item.Name}
                  isFocused={focusedItem?.Id === item.Id}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: focusedItem?.Id === item.Id ? "black" : "#ffffffff",
                  }}
                />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View
        style={{
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: 50,
          paddingRight: 50,
          backgroundColor: "#171717",
          borderTopColor: "#454545",
          borderTopWidth: 2,
        }}
      >
        <View
          style={{
            backgroundColor: "#171717",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            bottom: 0,
            width: "100%",
            alignItems: "baseline",
          }}
        >
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text
                style={{
                  color: "#9c9c9cff",
                  fontSize: 18,
                  fontFamily: "SpaceMono",
                  marginBottom: 20,
                }}
              >
                Focused item
              </Text>
              <FocusedItemWidget focusedItem={focusedItem} loading={loading} />
            </View>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text
                style={{
                  color: "#9c9c9cff",
                  fontSize: 18,
                  fontFamily: "SpaceMono",
                  marginBottom: 20,
                }}
              >
                Item description
              </Text>
              <AlbumOverviewWidget
                itemOverview={itemOverview}
                audioMetadata={audioMetadata}
              />
            </View>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text
                style={{
                  color: "#9c9c9cff",
                  fontSize: 18,
                  fontFamily: "SpaceMono",
                  marginBottom: 20,
                }}
              >
                Now playing
              </Text>
              <NowPlayingWidget metadata={audioMetadata} />
            </View>
          </View>
        </View>
        <View style={{paddingTop: 10}}>
          <Text style={{ color: "#9c9c9cff", fontFamily: "SpaceMono" }}>Press Left to open Finale Menu</Text></View>
      </View>
    </>
  );
}
