import { Text, View } from "react-native";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";

interface AlbumOverviewWidgetProps {
  itemOverview: string | null;
  audioMetadata: JellyfinItem | null;
}

export const AlbumOverviewWidget = ({ itemOverview, audioMetadata }: AlbumOverviewWidgetProps) => {
  // console.log("Album Overview Widget: " + itemOverview);
  return (
    <View
      style={{
        width: 600,
        height: 150,
        maxHeight: 150,
        overflow: "scroll",
        flexWrap: "wrap",
        flexShrink: 1,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "white", fontFamily: "SpaceMono", fontSize: 16 }}>
        {itemOverview
          ? itemOverview
          : "No overview available."}
      </Text>
      {/* If the current itemOverview exists no matter what, it'll show what title that's currently playing. Otherwise, it'll null out, and it'll show the placeholder text. */}
    </View>
  );
};

