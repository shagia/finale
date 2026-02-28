import { Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import MarqueeText from "@/components/MarqueeText";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getRoundedMinute } from "@/scripts/helpers/getMinuteValue";

export const NowPlayingWidget = () => {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  const { handleNextTrack, handlePreviousTrack, currentTrack } = usePlayback();
  const router = useRouter();
  const metadata = currentTrack;

  if (!metadata) {
    return (
      <View
        style={{
          backgroundColor: "lightgray",
          flexDirection: "row",
          minWidth: 200,
          height: 150,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontFamily: "IBM Plex Mono", color: "black" }}>
          Nothing playing
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "lightgray",
        flexDirection: "row",
        minWidth: 200,
        height: 150,
      }}
    >
      <View style={{ marginRight: 10 }}>
        <TouchableOpacity onPress={() => router.navigate("/playing")}>
          <Image
            source={{
              uri: `${AUTH_URL}/Items/${metadata.AlbumId}/Images/Primary`,
            }}
            style={{ width: 150, height: 150 }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          padding: 5,
          justifyContent: "space-between",
          flexDirection: "column",
          minWidth: 180,
        }}
      >
        <View>
          <MarqueeText
            text={metadata.Name}
            width={250}
            style={{
              fontFamily: "IBM Plex Mono",
              color: "black",
            }}
          />
          <MarqueeText
            text={metadata.AlbumArtist ?? ""}
            width={250}
            style={{
              fontFamily: "IBM Plex Mono",
              color: "black",
            }}
          />
          <MarqueeText
            text={metadata.Album}
            width={250}
            style={{
              fontFamily: "IBM Plex Mono",
              color: "black",
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>{`${getRoundedMinute(status?.currentTime || 0)}`}</Text>
          <TouchableOpacity
            onPress={() => {
              handlePreviousTrack();
            }}
          >
            <Ionicons name="play-skip-back" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (status?.playing) {
                player?.pause();
              } else {
                player?.play();
              }
            }}
          >
            <Ionicons
              name={status?.playing ? "pause" : "play"}
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleNextTrack();
            }}
          >
            <Ionicons name="play-skip-forward" size={30} color="black" />
          </TouchableOpacity>
          <Text>{`${getRoundedMinute(status?.duration || 0)}`}</Text>
        </View>
      </View>
    </View>
  );
};
