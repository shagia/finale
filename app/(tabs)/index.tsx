import { Text, Image, View, ScrollView, Pressable } from "react-native";
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

export default function HomePage() {
  const jellyfinApi = getJellyfinApi({
    baseUrl: AUTH_URL,
    username: USER_AUTH.username,
    password: USER_AUTH.password,
    // ! DO NOT USE THESE CREDENTIALS IN PRODUCTION, replace with a constants file that's ignored !
  });
  const [data, setData] = useState<JellyfinItem[] | null>(null);
  const [focusedItem, setFocusedItem] = useState<JellyfinItem | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<JellyfinItem | null>(null);
  const [itemOverview, setItemOverview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { playTrack, setQueueItems, currentTrack } = usePlayback();
  
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

useEffect(() => {
    if (currentTrack) {
      // Update overview when track changes
      getItemOverview(currentTrack.AlbumId).then(setItemOverview);
      setAudioMetadata(currentTrack);
    }
  }, [currentTrack]);

  return (
    <>
      <Header page="home" />
      <ItemList page="home" list={data || []} />
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
        <View style={{ paddingTop: 10 }}>
          <Text style={{ color: "#9c9c9cff", fontFamily: "SpaceMono" }}>
            Press Left to open Finale Menu
          </Text>
        </View>
      </View>
    </>
  );
}
