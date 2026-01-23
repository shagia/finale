import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import { JellyfinItem, getJellyfinApi } from "@/scripts/services/jellyfin-api";
import { useFocusedItem } from "@/components/FocusedItemProvider";
import { USER_AUTH } from "@/constants/secrets/user-details";
import { useMemo } from "react";
import { queueAndPlayAlbum } from "@/scripts/helpers/queueAndPlayAlbum";

interface ItemListProps {
    page: "home" | "playing";
    list: JellyfinItem[];
    currentTrack?: JellyfinItem | null;
}

export default function ItemList({ page, list }: ItemListProps) {
    const { playTrack, setQueueItems, currentTrack } = usePlayback();
    const { focusedItem, setFocusedItem } = useFocusedItem();
    
    // TODO: There is already a present JellyfinAPI instance, just use that one instead
    const jellyfinApi = useMemo(() => {
        if (page === "home") {
            return getJellyfinApi({
                baseUrl: AUTH_URL,
                username: USER_AUTH.username,
                password: USER_AUTH.password,
            });
        }
        return null;
    }, [page]);
    
    console.log(list)
    
  return (
    <ScrollView
      pagingEnabled={true}>
      {list.map((item) => {
        const isCurrent = currentTrack?.Id === item.Id;
        const isFocused = focusedItem?.Id === item.Id;
        return (
          <Pressable
            key={item.Id}
            onPress={async () => {
                // On the home page, items are albums that can be queued. On the playing page, items are tracks belonging to the queue that can be played. Could this be defined better?
              if (page === "home") {
                if (!jellyfinApi) return;
                try {
                  await queueAndPlayAlbum(
                    item.Id,
                    item.Name,
                    jellyfinApi,
                    setQueueItems,
                    playTrack
                  );
                } catch (error) {
                  console.error("Error queueing album:", error);
                }
              } else {
                console.log(`Playing item: ${item.Name}`);
                playTrack(item);
              }
            }}
            onFocus={() => {
              setFocusedItem(item);
            }}
            onBlur={() => {
              // Only clear focus if this was the focused item
              if (focusedItem?.Id === item.Id) {
                setFocusedItem(null);
              }
            }}
            onHoverIn={() => {
              setFocusedItem(item);
            }}
            onHoverOut={() => {
              // Only clear focus if this was the focused item
              if (focusedItem?.Id === item.Id) {
                setFocusedItem(null);
              }
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "center",
                alignContent: "center",
                backgroundColor: isFocused ? "rgba(255, 255, 255, 0.1)" : "transparent",
                borderRadius: 5,
                margin: 5,
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
                    color: isCurrent ? "white" : isFocused ? "white" : "grey",
                    fontFamily: "SpaceMono",
                  }}
                >
                  {item.AlbumArtist}
                </Text>
                <Text
                  style={{
                    color: isCurrent ? "white" : isFocused ? "white" : "grey",
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
