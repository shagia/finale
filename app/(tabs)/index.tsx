import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Alert,
  Pressable,
} from "react-native";
import JellyfinAPI, { JellyfinItem } from "@/scripts/services/jellyfin-api";
import { USER_AUTH } from "@/constants/secrets/user-details";
import MarqueeText from "@/components/MarqueeText";
import { requestAudioPlayback } from "@/scripts/services/audio-service";
import { FocusedItemWidget } from "@/components/widgets/focusedItemWidget";
import { NowPlayingWidget } from "@/components/widgets/nowPlayingWidget";
import { AudioStatus } from "expo-audio";

export default function Index() {
  const [publicURL, setPublicURL] = useState<string | null>(null);
  const [data, setData] = useState<JellyfinItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusedItem, setFocusedItem] = useState<JellyfinItem | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<JellyfinItem | null>(null);
  const [itemOverview, setItemOverview] = useState<string | null>(null);

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
    baseUrl: "http://yuji:8096/",
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

  return (
    <>
      <ScrollView
        focusable={true}
        hasTVPreferredFocus
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
              console.log("First Album Item ID:", albumItems.Items[0].Id);
              setAudioMetadata(albumItems.Items[0]);
              console.log("Audio Metadata:", audioMetadata);
              const itemOverviewRaw = await getItemOverview(
                albumItems.Items[0].AlbumId
              ); // Right now, this gets the overview for the first item in the album, and then it gets the parent or album ID that it belongs to. Not good, but it's a start.
              setItemOverview(itemOverviewRaw);

              console.log("Item Overview Text: " + itemOverviewRaw);
              // TODO: This is a static URL. We need to get the actual audio URL from the Jellyfin API by concatinating the base URL, the item ID and the stream.
              await requestAudioPlayback(
                `http://yuji:8096/Audio/${albumItems.Items[0].Id}/stream.mp3`
              );
              Alert.alert(
                "Item Pressed",
                `You pressed on ${item.Name}, ${item.Id}`
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
                padding: 15,
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
                  uri: `http://yuji:8096/Items/${item.Id}/Images/Primary`, // Replace with base URL variable
                }}
              />
              <View style={{ paddingTop: 10 }}>
                <MarqueeText
                  text={item.AlbumArtist}
                  isFocused={focusedItem?.Id === item.Id}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: focusedItem?.Id === item.Id ? "black" : "white",
                  }}
                />
                <MarqueeText
                  text={item.Name}
                  isFocused={focusedItem?.Id === item.Id}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: focusedItem?.Id === item.Id ? "black" : "white",
                  }}
                />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          bottom: 50,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 50,
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
        <FocusedItemWidget focusedItem={focusedItem} loading={loading} />

        <View
          style={{
            position: "fixed",
            backgroundColor: "lightgray",
            left: "30%",
            width: 600,
            flexWrap: "wrap",
            flexShrink: 1,
          }}
        >
          <Text style={{ color: "black" }}>
            {itemOverview
              ? itemOverview
              : "No overview is available for " +
                audioMetadata?.Name +
                ". Fill out the overview for " +
                audioMetadata?.Name +
                " in the Jellyfin web interface to see it here."}
          </Text>
          {/* If the current itemOverview exists no matter what, it'll show what title that's currently playing. Otherwise, it'll null out, and it'll show the placeholder text. */}
        </View>
        <NowPlayingWidget metadata={audioMetadata} />
      </View>
    </>
  );
}
