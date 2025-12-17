import { Text, Image, View, ScrollView } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { getRoundedMinute } from "@/scripts/helpers/getMinuteValue";
import Header from "@/components/header";

export default function PlayingPage() {
  const player = getAudioPlayer();
  const status = useGlobalAudioPlayerStatus(player);
  const { handleNextTrack, handlePreviousTrack, currentTrack, queue } =
    usePlayback();
  console.log(player);
  //console.log("Current Track: " + currentTrack?.Name);
  return (
    <>
      <Header page="playing" />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
        }}
      >
        <View style={{ width: "80%", height: 800 }}>
          <View>
            <Image
              source={{
                uri: `${AUTH_URL}/Items/${currentTrack?.AlbumId}/Images/Primary`,
              }}
              style={{ width: "100%", height: 800 }}
            />
          </View>
          <View>
            <Text style={{ color: "white" }}>{currentTrack?.Id}</Text>
            <Text style={{ color: "white" }}>{currentTrack?.AlbumId}</Text>
            <Text style={{ color: "white" }}>{currentTrack?.AlbumArtist}</Text>
            <Text style={{ color: "white" }}>{currentTrack?.Album}</Text>
            <Text style={{ color: "white" }}>{currentTrack?.Overview}</Text>
            <Text style={{ color: "white" }}>
              {currentTrack?.ProductionYear}
            </Text>
            <Text style={{ color: "white" }}>
              {getRoundedMinute(status?.currentTime || 0)} /{" "}
              {getRoundedMinute(status?.duration || 0)}
            </Text>
            <Text style={{ color: "white" }}>{currentTrack?.Name}</Text>
            <Text style={{ color: "white" }}>
              {status?.playing ? "Playing" : "Paused"}
            </Text>
            <Text style={{ color: "white" }}>Playing Page</Text>
          </View>
        </View>
        <View
          style={{
            marginBottom: 40,
            marginLeft: 40,
            width: "20%",
            height: 800,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            Queue
          </Text>
          <ScrollView>
            {queue?.map((track) => {
              const isCurrent = currentTrack?.Id === track.Id;
              return (
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                  key={track.Id}
                >
                  <View>
                    <Image
                      source={{
                        uri: `${AUTH_URL}/Items/${track.AlbumId}/Images/Primary`, // Replace with base URL variable
                      }}
                      style={{ width: 50, height: 50, marginRight: 10 }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: isCurrent ? "white" : "grey",
                        fontWeight: isCurrent ? "bold" : "normal",
                      }}
                    >
                      {track.AlbumArtist}
                    </Text>
                    <Text
                      style={{
                        color: isCurrent ? "white" : "grey",
                        fontWeight: isCurrent ? "bold" : "normal",
                      }}
                    >
                      {track.Name}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
}
