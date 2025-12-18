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
              marginLeft: 40,
              width: "20%",
              height: "100%",
            }}
          >
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                marginTop: 20,
                fontFamily: "SpaceMono",
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
                          fontFamily: "SpaceMono",
                        }}
                      >
                        {track.AlbumArtist}
                      </Text>
                      <Text
                        style={{
                          color: isCurrent ? "white" : "grey",
                          fontFamily: "SpaceMono",
                        }}
                      >
                        {track.Name}
                      </Text>
                      <Text
                        style={{
                          color: isCurrent ? "white" : "grey",
                          fontFamily: "SpaceMono",
                        }}
                      >
                        {track.Id}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
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

            <View>
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
                <Text style={{ color: "white" }}>Favourite</Text>
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

            <Text style={{ color: "white" }}>
              {status?.playing ? "Playing" : "Paused"}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
