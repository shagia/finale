import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";

interface ItemListProps {
    page: "home" | "playing";
    list: JellyfinItem[];
    currentTrack?: JellyfinItem | null;
}

export default function ItemList({ page, list, currentTrack }: ItemListProps) {
    console.log(list)
  return (
    <ScrollView>
      {list.map((item) => {
        const isCurrent = currentTrack?.Id === item.Id;
        return (
          <Pressable
            key={item.Id}
            onPress={() => {
              console.log(`Seeking to item: ${item.Name}`);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <View>
                <Image
                  source={{
                    uri: `${AUTH_URL}/Items/${page === "home" ? item.Id : item.AlbumId}/Images/Primary`, // Replace with base URL variable
                  }}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <View
                style={{
                  backgroundColor: isCurrent ? "black" : "transparent",
                  width: "70%",
                  paddingLeft: 10,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: isCurrent ? "white" : "grey",
                    fontFamily: "SpaceMono",
                  }}
                >
                  {item.AlbumArtist}
                </Text>
                <Text
                  style={{
                    color: isCurrent ? "white" : "grey",
                    fontFamily: "SpaceMono",
                  }}
                >
                  {item.Name}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
