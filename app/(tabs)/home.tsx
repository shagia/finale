import { Text, Image, View, ScrollView, Pressable } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { getRoundedMinute } from "@/scripts/helpers/getMinuteValue";
import JellyfinAPI, { JellyfinItem } from "@/scripts/services/jellyfin-api";
import Header from "@/components/header";
import ItemList from "@/components/ItemList";
import { USER_AUTH } from "@/constants/secrets/user-details";
import { useEffect, useState } from "react";

export default function HomePage() {
  const jellyfinApi = new JellyfinAPI({
    baseUrl: AUTH_URL,
    username: USER_AUTH.username,
    password: USER_AUTH.password,
    // ! DO NOT USE THESE CREDENTIALS IN PRODUCTION, replace with a constants file that's ignored !
  });
  const [data, setData] = useState<JellyfinItem[] | null>(null);
  const [loading, setLoading] = useState(true);
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
      <Text>Home Page</Text>
      <ItemList page="home" list={data || []} />
    </>
  );
}
