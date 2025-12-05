import { Text, View, Image } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";
import MarqueeText from "@/components/MarqueeText";

import { getMinute, getRoundedMinute, getSecond } from "@/scripts/helpers/getMinuteValue";
interface NowPlayingWidgetProps {
  metadata: JellyfinItem | null;
}

// TODO: The metadata should also be imported instead of fetched as a prop
export const NowPlayingWidget = ({ metadata }: NowPlayingWidgetProps) => {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  console.log(status);
  console.log(`${getMinute(status?.currentTime || 0)}:${getSecond(status?.currentTime || 0)}`);
  console.log(metadata);
  return (
    <View style={{ backgroundColor: "lightgray", flexDirection: "row", minWidth: 200}}>
      <View style={{ marginRight: 10 }}>
        <Image
          source={{
            uri: `http://yuji:8096/Items/${metadata?.AlbumId}/Images/Primary`, // Replace with base URL variable
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>{`${getRoundedMinute(status?.currentTime || 0)}`}</Text>
            <Text>{status?.playing ? "Playing" : "Stopped"}</Text>
            <Text>{`${getRoundedMinute(status?.duration || 0)}`}</Text>
        </View>
      </View>
    </View>
  );
};
