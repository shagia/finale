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
        backgroundColor: "lightgray",
        width: 600,
        height: 100,
        maxHeight: 100,
        overflow: "scroll",
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        flexWrap: "wrap",
        flexShrink: 1,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "black" }}>
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

