import {
  Text,
  Image,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { getRoundedMinute } from "@/scripts/helpers/getMinuteValue";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";
import { getJellyfinApi } from "@/scripts/services/jellyfin-api";
import Header from "@/components/header";
import ItemList from "@/components/ItemList";
import { USER_AUTH } from "@/constants/secrets/user-details";
import { useEffect, useState } from "react";
import { FocusedItemWidget } from "@/components/widgets/focusedItemWidget";
import { AlbumOverviewWidget } from "@/components/widgets/albumOverviewWidget";
import { NowPlayingWidget } from "@/components/widgets/nowPlayingWidget";
import { getItemOverview } from "@/scripts/helpers/getItemOverview";
import { refreshItems } from "@/scripts/helpers/refreshItems";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomePage() {
  const jellyfinApi = getJellyfinApi({
    baseUrl: AUTH_URL,
    username: USER_AUTH.username,
    password: USER_AUTH.password,
    // ! DO NOT USE THESE CREDENTIALS IN PRODUCTION, replace with a constants file that's ignored !
  });
  const [data, setData] = useState<JellyfinItem[] | null>(null);
  const [itemOverview, setItemOverview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { playTrack, setQueueItems, currentTrack } = usePlayback();

  const fetchData = () => refreshItems(jellyfinApi, { setData, setLoading });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentTrack) {
      getItemOverview(currentTrack.AlbumId).then(setItemOverview);
    }
  }, [currentTrack]);

  return (
    <>
      <Header page="home" />
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
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
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
              It's thinking . . .
            </Text>
            <Pressable
              style={{ paddingTop: 10, zIndex: 1000 }}
              onPress={() => fetchData()}
            >
              <View>
                <Ionicons name="refresh-outline" size={18} color="white" />
              </View>
            </Pressable>
          </View>
          <ItemList
            page="home"
            list={data || []}
            jellyfinApi={jellyfinApi}
            onFavoriteToggle={(item) => {
              // Optimistically update the item in the list instead of refetching everything
              if (data) {
                setData(
                  data.map((i): JellyfinItem => {
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
              }
            }}
          />
        </View>
      </View>
      <View
        style={{
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: 50,
          paddingRight: 50,
          backgroundColor: "#171717",
          borderTopColor: "#454545",
          borderTopWidth: 1,
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
                audioMetadata={currentTrack}
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
              <NowPlayingWidget />
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={{ color: "#9c9c9cff", fontFamily: "SpaceMono" }}>
            Press Left to open Finale Menu
          </Text>
        </View>
      </View>
    </>
  );
}
