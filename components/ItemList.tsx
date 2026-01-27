import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { getAudioPlayer } from "@/scripts/services/audio-service";
import { useGlobalAudioPlayerStatus } from "@/hooks/useGlobalAudioPlayerStatus";
import { usePlayback } from "@/components/PlaybackProvider";
import { AUTH_URL } from "@/constants/secrets/auth-headers";
import {
  JellyfinItem,
  getJellyfinApi,
  getJellyfinApiIfExists,
} from "@/scripts/services/jellyfin-api";
import { useFocusedItem } from "@/components/FocusedItemProvider";
import { USER_AUTH } from "@/constants/secrets/user-details";
import { useMemo } from "react";
import { queueAndPlayAlbum } from "@/scripts/helpers/queueAndPlayAlbum";

interface ItemListProps {
  page: "home" | "playing";
  list: JellyfinItem[];
  currentTrack?: JellyfinItem | null;
  jellyfinApi?: ReturnType<typeof getJellyfinApi> | null;
  onFavoriteToggle?: (item: JellyfinItem) => void;
}

export default function ItemList({
  page,
  list,
  jellyfinApi: jellyfinApiProp,
  onFavoriteToggle,
}: ItemListProps) {
  const { playTrack, setQueueItems, currentTrack } = usePlayback();
  const { focusedItem, setFocusedItem } = useFocusedItem();

  const jellyfinApi = useMemo(() => {
    if (jellyfinApiProp != null) return jellyfinApiProp;
    if (page === "home") {
      return getJellyfinApi({
        baseUrl: AUTH_URL,
        username: USER_AUTH.username,
        password: USER_AUTH.password,
      });
    }
    return getJellyfinApiIfExists();
  }, [page, jellyfinApiProp]);

  return (
    <ScrollView pagingEnabled={true}>
      {list.map((item) => {
        const isCurrent = currentTrack?.Id === item.Id;
        const isFocused = focusedItem?.Id === item.Id;
        const isFavorite = item.UserData?.IsFavorite
          ? "Favorited"
          : "Not Favorited";
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
                    playTrack,
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
                backgroundColor: isFocused
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: isCurrent
                          ? "white"
                          : isFocused
                            ? "white"
                            : "grey",
                        fontFamily: "SpaceMono",
                      }}
                    >
                      {item.AlbumArtist}
                    </Text>
                    <Text
                      style={{
                        color: isCurrent
                          ? "white"
                          : isFocused
                            ? "white"
                            : "grey",
                        fontFamily: "SpaceMono",
                      }}
                    >
                      {item.Name}
                    </Text>
                  </View>
                  <Pressable
                    onPress={async (e) => {
                      e?.stopPropagation?.();
                      if (!jellyfinApi) return;
                      try {
                        if (item.UserData?.IsFavorite) {
                          await jellyfinApi.unmarkItemAsFavorite(item.Id);
                        } else {
                          await jellyfinApi.markItemAsFavorite(item.Id);
                        }
                        onFavoriteToggle?.(item);
                      } catch (err) {
                        console.error("Failed to toggle favorite:", err);
                      }
                    }}
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Text
                      style={{
                        color: isCurrent
                          ? "white"
                          : isFocused
                            ? "white"
                            : "grey",
                        fontFamily: "SpaceMono",
                      }}
                    >
                      {isFavorite}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
