import { Text, Image, View, ScrollView, Pressable } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { getRoundedMinute } from "@/scripts/helpers/getMinuteValue";
import Header from "@/components/header";
import ItemList from "@/components/ItemList";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getJellyfinApiIfExists, JellyfinItem } from "@/scripts/services/jellyfin-api";

export default function PlayingPage() {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  const { handleNextTrack, handlePreviousTrack, currentTrack, queue, currentIndex, updateQueueItems } =
    usePlayback();
  const jellyfinApi = getJellyfinApiIfExists();
  console.log(player);
  //console.log("Current Track: " + currentTrack?.Name);
  return (
    <>
      <Header page="playing" />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Hero Section & Queue */}
        <View
          style={{
            width: "100%",
            height: "72.1%",
            flexDirection: "row",
            borderBottomColor: "#454545",
            borderBottomWidth: 2,
          }}
        >
          <View style={{ width: "80%", height: "100%" }}>
            <Image
              source={{
                uri: `${AUTH_URL}/Items/${currentTrack?.AlbumId}/Images/Primary`,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          {/* Queue Component */}
          <View
            style={{
              marginBottom: 40,
              paddingLeft: 40,
              paddingRight: 40,
              width: "20%",
              height: "100%",
            }}
          >
            <View style={{
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                marginTop: 20,
                fontFamily: "SpaceMono",
                textAlign: "left",
              }}
            >
              Queue
            </Text>
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                marginTop: 20,
                fontFamily: "SpaceMono",
                textAlign: "right",
              }}
            >
              {currentIndex >= 0 ? `• ${currentIndex + 1}` : ''} / {queue?.length || 0}
            </Text>
            </View>
            <ItemList
              page="playing"
              list={queue || []}
              currentTrack={currentTrack}
              jellyfinApi={jellyfinApi}
              onFavoriteToggle={(item) => {
                // Updates the currently toggled item to update favorite status in the item list
                updateQueueItems((items) =>
                  items.map((i): JellyfinItem => {
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
                  })
                );
              }}
            />
          </View>
        </View>
        {/* Song Details & Controller */}
        <View
          style={{
            marginLeft: 80,
            marginRight: 80,
            position: "relative",
            bottom: 80,
          }}
        >
          <View
            style={{
              position: "relative",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 20,
            }}
          >
            <View style={{ width: 300, height: 300 }}>
              <Image
                source={{
                  uri: `${AUTH_URL}/Items/${currentTrack?.AlbumId}/Images/Primary`,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <View style={{ width: "50%", }}>
              <View
                style={{
                  position: "absolute",
                  top: -40,
                  left: 0,
                  flexDirection: "row",
                  gap: 20,
                  backgroundColor: "black",
                }}
              >
                <Pressable onPress={async () => {
                  if (!currentTrack || !jellyfinApi) return;
                  try {
                    if (currentTrack.UserData?.IsFavorite) {
                      await jellyfinApi.unmarkItemAsFavorite(currentTrack.Id);
                    } else {
                      await jellyfinApi.markItemAsFavorite(currentTrack.Id);
                    }
                    // Optimistically update the queue to reflect the favorite status change
                    updateQueueItems((items) =>
                      items.map((i): JellyfinItem => {
                        if (i.Id === currentTrack.Id) {
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
                      })
                    );
                  } catch (err) {
                    console.error("Failed to toggle favorite:", err);
                  }
                }} style={{ }}>
                  {currentTrack?.UserData?.IsFavorite ? <Ionicons name="heart" size={36} color="red" /> : <Ionicons name="heart-outline" size={36} color="grey" />}
                </Pressable>
                <Text style={{ color: "white" }}>Quality</Text>
                <Text style={{ color: "white" }}>Lyrics</Text>
              </View>
              <View style={{ marginBottom: 20 }}>
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 54,
                      fontFamily: "SpaceMono",
                    }}
                  >
                    {currentTrack?.AlbumArtist}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 34,
                      fontFamily: "SpaceMono",
                    }}
                  >
                    {currentTrack?.Name}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 26,
                    fontFamily: "SpaceMono",
                  }}
                >
                  {currentTrack?.Album} / {currentTrack?.ProductionYear}
                </Text>

                <Text
                  style={{
                    color: "white",
                    fontSize: 26,
                    fontFamily: "SpaceMono",
                  }}
                >
                  WAV / 2 Channels / 584 Kbps / Direct Stream
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "30%",
                bottom: "15%"
              }}
            >
              <Pressable
                onPress={() => {
                  handlePreviousTrack();
                }}
                style={{
                    width: 100, height: 100,
                }}
              >
                <Ionicons name="play-skip-back" size={100} color="white" />
              </Pressable>
              <Pressable
                onPress={() => {
                  if (status?.playing) {
                    player?.pause();
                  } else {
                    player?.play();
                  }
                  
                }}

                style={{
                    width: 100, height: 100,
                }}
              >
                <Ionicons name={status?.playing ? "pause" : "play"} size={100} color="white" />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleNextTrack();
                }}
                style={{
                    width: 100, height: 100,
                }}
              >
                <Ionicons name="play-skip-forward" size={100} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
