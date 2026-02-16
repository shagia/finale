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
  FlatList,
} from "react-native";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";
import { getJellyfinApi } from "@/scripts/services/jellyfin-api";
import { USER_AUTH } from "@/constants/secrets/user-details";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import MarqueeText from "@/components/MarqueeText";
import { FocusedItemWidget } from "@/components/widgets/focusedItemWidget";
import { NowPlayingWidget } from "@/components/widgets/nowPlayingWidget";
import { AlbumOverviewWidget } from "@/components/widgets/albumOverviewWidget";
import { usePlayback } from "@/components/PlaybackProvider";
import { getItemOverview } from "@/scripts/helpers/getItemOverview";
import { queueAndPlayAlbum } from "@/scripts/helpers/queueAndPlayAlbum";
import { refreshItems } from "@/scripts/helpers/refreshItems";
import Header, { type ViewMode } from "@/components/header";
import { useFocusedItem } from "@/components/FocusedItemProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getRoundedMinuteFromMicroseconds,
  getRoundedMinute,
} from "@/scripts/helpers/getMinuteValue";

interface ExplorerProps {
  viewMode?: ViewMode;
}

// For debugging only. Once the functionality for a view setting is added, this will be binded to a localStorage or cookie value
const defaultViewMode: ViewMode = "flatlist";

export default function Index({ viewMode: initialViewMode = defaultViewMode }: ExplorerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [publicURL, setPublicURL] = useState<string | null>(null);
  const [data, setData] = useState<JellyfinItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { focusedItem, setFocusedItem } = useFocusedItem();
  const [audioMetadata, setAudioMetadata] = useState<JellyfinItem | null>(null);
  const [itemOverview, setItemOverview] = useState<string | null>(null);
  const router = useRouter();

  // Playback control functions from context
  const { playTrack, setQueueItems, currentTrack, updateQueueItems } =
    usePlayback();

  const createTwoButtonAlert = () =>
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  const jellyfinApi = getJellyfinApi({
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

  const fetchData = () => refreshItems(jellyfinApi, { setData, setLoading });

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Update metadata when current track changes
   */
  useEffect(() => {
    if (currentTrack) {
      // Update overview when track changes
      getItemOverview(currentTrack.AlbumId).then(setItemOverview);
      setAudioMetadata(currentTrack);
    }
  }, [currentTrack]);
  return (
    <View style={{ flex: 1 }}>
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={() => void fetchData()}
      />
      {viewMode === "flatlist" && (
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            left: 80,
            flexDirection: "row",
            gap: 10,
            width: "100%",
            zIndex: 1000,
            backgroundColor: "#171717",
          }}
        >
          <View
            style={{
              width: 390,
            }}
          >
            <Text
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 14,
                color: "white",
              }}
            >
              Item
            </Text>
          </View>
          <View
            style={{
              paddingRight: 44,
            }}
          >
            <Text
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 14,
                color: "white",
              }}
            >
              Year
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 14,
                color: "white",
              }}
            >
              Runtime
            </Text>
          </View>
        </View>
      )}
      {viewMode === "flatlist" && (
        <FlatList
          data={data}
          initialNumToRender={data?.length} // This will soon be tied to a max item variable set by the user
          pagingEnabled={true}
          contentContainerStyle={{
            gap: 8,
            paddingLeft: 80,
            paddingRight: 80,
            marginTop: 40,
          }}
          renderItem={({ item }) => (
            <View style={{ borderTopWidth: 0, borderTopColor: "#3C3C3C", borderBottomWidth: 2, borderBottomColor: "#3C3C3C", paddingTop: 0, paddingBottom: 8 }}>
              <Pressable
                onPress={async () => {
                  try {
                    const albumItems = await queueAndPlayAlbum(
                      item.Id,
                      item.Name,
                      jellyfinApi,
                      setQueueItems,
                      playTrack,
                    );
  
                    Alert.alert(
                      "Item Pressed",
                      `You pressed on ${item.Name}, ${item.Id}. Queue created with ${albumItems.length} tracks.`,
                    );
                  } catch (error) {
                    console.error("Error queueing album:", error);
                    Alert.alert("Error", `Failed to queue album: ${item.Name}`);
                  }
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
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 5,
                    }}
                    source={{
                      uri: `${AUTH_URL}/Items/${item.Id}/Images/Primary`,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <View style={{}}>
                        <Text
                          style={{
                            fontFamily: "IBM Plex Mono",
                            fontSize: 14,
                            color: "white",
                          }}
                        >
                          <MarqueeText
                            text={item.AlbumArtist || "Unknown Artist"}
                            isFocused={focusedItem?.Id === item.Id}
                            width={250}
                            style={{
                              fontFamily: "IBM Plex Mono",
                              color:
                                focusedItem?.Id === item.Id
                                  ? "#ffffffff"
                                  : "#ffffffff",
                            }}
                          />
                        </Text>
                        <Text
                          style={{
                            fontFamily: "IBM Plex Mono",
                            fontSize: 14,
                            color: "white",
                          }}
                        >
                          <MarqueeText
                            text={item.Name || "Unknown Name"}
                            isFocused={focusedItem?.Id === item.Id}
                            width={250}
                            style={{
                              fontFamily: "IBM Plex Mono",
                              color:
                                focusedItem?.Id === item.Id
                                  ? "#ffffffff"
                                  : "#ffffffff",
                            }}
                          />
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingRight: 44,
                        }}
                      >
                        <Pressable
                          onPress={async () => {
                            if (!item || !jellyfinApi) return;
                            try {
                              if (item.UserData?.IsFavorite) {
                                await jellyfinApi.unmarkItemAsFavorite(item.Id);
                              } else {
                                await jellyfinApi.markItemAsFavorite(item.Id);
                              }
                              // Optimistically update the data state to reflect the favorite status change
                              setData(
                                (prevData) =>
                                  prevData?.map((i): JellyfinItem => {
                                    if (i.Id === item.Id) {
                                      return {
                                        ...i,
                                        UserData: i.UserData
                                          ? {
                                              ...i.UserData,
                                              IsFavorite:
                                                !i.UserData.IsFavorite,
                                            }
                                          : {
                                              IsFavorite: true,
                                              ItemId: i.Id,
                                              PlayCount: 0,
                                              Played: false,
                                              PlayedAt: "",
                                              PlayedAtTicks: 0,
                                            },
                                      };
                                    }
                                    return i;
                                  }) || null,
                              );
                            } catch (err) {
                              console.error("Failed to toggle favorite:", err);
                            }
                          }}
                          style={{}}
                        >
                          {item?.UserData?.IsFavorite ? (
                            <Ionicons name="heart" size={36} color="red" />
                          ) : (
                            <Ionicons
                              name="heart-outline"
                              size={36}
                              color="grey"
                            />
                          )}
                        </Pressable>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontFamily: "IBM Plex Mono",
                        fontSize: 14,
                        color: "white",
                        paddingRight: 44,
                      }}
                    >
                      {item.ProductionYear}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "IBM Plex Mono",
                        fontSize: 14,
                        color: "white",
                        paddingRight: 44,
                      }}
                    >
                      {getRoundedMinuteFromMicroseconds(item.RunTimeTicks || 0)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item.Id}
        />
      )}
      {viewMode === "scrollview" && (
        <ScrollView
          focusable={true}
          pagingEnabled={true}
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
            paddingTop: 20,
            paddingBottom: 50,
            marginBottom: 50,
            marginTop: 0,
            position: "relative",
            top: 10,
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
                try {
                  const albumItems = await queueAndPlayAlbum(
                    item.Id,
                    item.Name,
                    jellyfinApi,
                    setQueueItems,
                    playTrack,
                  );

                  Alert.alert(
                    "Item Pressed",
                    `You pressed on ${item.Name}, ${item.Id}. Queue created with ${albumItems.length} tracks.`,
                  );
                } catch (error) {
                  console.error("Error queueing album:", error);
                  Alert.alert("Error", `Failed to queue album: ${item.Name}`);
                }
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
                  paddingTop: 10,
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
                  focusedItem?.Id === item.Id && {
                    backgroundColor: "lightgray",
                  },
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
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ paddingTop: 10, flexDirection: "column" }}>
                    <MarqueeText
                      text={item.AlbumArtist || "Unknown Artist"}
                      isFocused={focusedItem?.Id === item.Id}
                      width={250}
                      style={{
                        fontFamily: "IBM Plex Mono",
                        color:
                          focusedItem?.Id === item.Id ? "black" : "#ffffffff",
                      }}
                    />
                    <MarqueeText
                      text={item.Name}
                      isFocused={focusedItem?.Id === item.Id}
                      width={250}
                      style={{
                        fontFamily: "IBM Plex Mono",
                        color:
                          focusedItem?.Id === item.Id ? "black" : "#ffffffff",
                      }}
                    />
                  </View>
                  {/* TODO: A pressable in a pressable is crazy, maybe this could sit outside the parent pressable? */}
                  <Pressable
                    onPress={async () => {
                      if (!item || !jellyfinApi) return;
                      try {
                        if (item.UserData?.IsFavorite) {
                          await jellyfinApi.unmarkItemAsFavorite(item.Id);
                        } else {
                          await jellyfinApi.markItemAsFavorite(item.Id);
                        }
                        // Optimistically update the data state to reflect the favorite status change
                        setData(
                          (prevData) =>
                            prevData?.map((i): JellyfinItem => {
                              if (i.Id === item.Id) {
                                return {
                                  ...i,
                                  UserData: i.UserData
                                    ? {
                                        ...i.UserData,
                                        IsFavorite: !i.UserData.IsFavorite,
                                      }
                                    : {
                                        IsFavorite: true,
                                        ItemId: i.Id,
                                        PlayCount: 0,
                                        Played: false,
                                        PlayedAt: "",
                                        PlayedAtTicks: 0,
                                      },
                                };
                              }
                              return i;
                            }) || null,
                        );
                      } catch (err) {
                        console.error("Failed to toggle favorite:", err);
                      }
                    }}
                    style={{
                      marginTop: 10,
                      right: -30,
                      alignSelf: "flex-start",
                      zIndex: 1000,
                    }}
                  >
                    {item?.UserData?.IsFavorite ? (
                      <Ionicons name="heart" size={24} color="red" />
                    ) : (
                      <Ionicons name="heart-outline" size={24} color="grey" />
                    )}
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 50,
          paddingLeft: 50,
          paddingRight: 50,
          backgroundColor: "#171717",
          borderTopColor: "#454545",
          borderTopWidth: 2,
          position: "relative",
          bottom: 38,
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
              <FocusedItemWidget loading={loading} />
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
        <View style={{ paddingTop: 10 }}>
          <Text style={{ color: "#9c9c9cff", fontFamily: "SpaceMono" }}>
            Press Left to open Finale Menu
          </Text>
        </View>
      </View>
    </View>
  );
}
