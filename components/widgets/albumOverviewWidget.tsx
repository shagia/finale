import { Text, View } from "react-native";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";

interface AlbumOverviewWidgetProps {
  itemOverview: string | null;
  audioMetadata: JellyfinItem | null;
}

export const AlbumOverviewWidget = ({ itemOverview, audioMetadata }: AlbumOverviewWidgetProps) => {
  return (
    <View
      style={{
        width: 600,
        height: 120,
        maxHeight: 120,
        overflow: "scroll",
        flexWrap: "wrap",
        flexShrink: 1,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "white", fontFamily: "SpaceMono", fontSize: 16 }}>
        {itemOverview
          ? itemOverview
          : "No overview is available for " +
            audioMetadata?.Name +
            ". Fill out the overview for " +
            audioMetadata?.Name +
            " in the Jellyfin web interface to see it here."}
      </Text>
      {/* If the current itemOverview exists no matter what, it'll show what title that's currently playing. Otherwise, it'll null out, and it'll show the placeholder text. */}
    </View>
  );
};

