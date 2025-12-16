import { Text, View, Image, Pressable, TouchableOpacity } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";
import MarqueeText from "@/components/MarqueeText";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";

import { getMinute, getRoundedMinute, getSecond } from "@/scripts/helpers/getMinuteValue";
interface NowPlayingWidgetProps {
  metadata: JellyfinItem | null;
}

// TODO: The metadata should also be imported instead of fetched as a prop
export const NowPlayingWidget = ({ metadata }: NowPlayingWidgetProps) => {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  const { handleNextTrack, handlePreviousTrack } = usePlayback();
  //console.log(status);
  //console.log(`${getMinute(status?.currentTime || 0)}:${getSecond(status?.currentTime || 0)}`);
  //console.log(metadata);
  return (
    <View style={{ backgroundColor: "lightgray", flexDirection: "row", minWidth: 200}}>
      <View style={{ marginRight: 10 }}>
        <Image
          source={{
            uri: `${AUTH_URL}/Items/${metadata?.AlbumId}/Images/Primary`, // Replace with base URL variable
          }}
          style={{ width: 120, height: 120 }}
        />
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
                  text={`${metadata?.Name}`}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: "black",}}
                />
          <MarqueeText
                  text={`${metadata?.AlbumArtist}`}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: "black",}}
                />
          <MarqueeText
                  text={`${metadata?.Album}`}
                  width={250}
                  style={{
                    fontFamily: "IBM Plex Mono",
                    color: "black",}}
                />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>{`${getRoundedMinute(status?.currentTime || 0)}`}</Text>
            <TouchableOpacity onPress={() => {
              handlePreviousTrack();
            }}>
            <Image 
              style={{ width: 30, height: 30 }}
              source={{
              uri: `https://placehold.co/30x30?text=Nextfont=source-sans-pro`
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (status?.playing) {
                player?.pause();
              } else {
                player?.play();
              }
            }}>
            <Image 
              style={{ width: 30, height: 30 }}
              source={{
              uri: `https://placehold.co/30x30?text=${status?.playing ? "⏹︎" : "▶"}&font=source-sans-pro`
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              handleNextTrack();
            }}>
            <Image 
              style={{ width: 30, height: 30 }}
              source={{
              uri: `https://placehold.co/30x30?text=Nextfont=source-sans-pro`
            }} />
            </TouchableOpacity>
            <Text>{`${getRoundedMinute(status?.duration || 0)}`}</Text>
        </View>
      </View>
    </View>
  );
};
