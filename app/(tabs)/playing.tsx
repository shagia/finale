import { Text, Image, View, ScrollView } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { getRoundedMinute } from "@/scripts/helpers/getMinuteValue";

export default function PlayingPage() {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  const { handleNextTrack, handlePreviousTrack, currentTrack, queue } = usePlayback();
  console.log(player);
  //console.log("Current Track: " + currentTrack?.Name);
  return (
    <View style={{ flex: 1, flexDirection: "row",  backgroundColor: "black" }}>
      <View>
        <Image
                  source={{
                    uri: `${AUTH_URL}/Items/${currentTrack?.AlbumId}/Images/Primary`, // Replace with base URL variable
                  }}
                  style={{ width: 800, height: 800 }}
                />
      <Text style={{ color: "white" }}>{currentTrack?.Id}</Text>
      <Text style={{ color: "white" }}>{currentTrack?.AlbumId}</Text>
      <Text style={{ color: "white" }}>{currentTrack?.AlbumArtist}</Text>
      <Text style={{ color: "white" }}>{currentTrack?.Album}</Text>
      <Text style={{ color: "white" }}>{currentTrack?.Overview}</Text>
      <Text style={{ color: "white" }}>{currentTrack?.ProductionYear}</Text>
      <Text style={{ color: "white" }}>{getRoundedMinute(status?.currentTime || 0)} / {getRoundedMinute(status?.duration || 0)}</Text>
      <Text style={{ color: "white" }}>{currentTrack?.Name}</Text>
      <Text style={{ color: "white" }}>{status?.playing ? "Playing" : "Paused"}</Text>
      <Text style={{ color: "white" }}>Playing Page</Text>
      </View>
      <View style={{ marginTop: 40, width: "80%", maxHeight: 400 }}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Queue
        </Text>
        <ScrollView>
          {queue?.map((track) => {
            const isCurrent = currentTrack?.Id === track.Id;
            return (
              <Text
                key={track.Id}
                style={{
                  color: isCurrent ? "white" : "grey",
                  fontWeight: isCurrent ? "bold" : "normal",
                  marginBottom: 6,
                }}
              >
                {track.Name}
              </Text>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
