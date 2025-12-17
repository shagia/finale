import {
  Text,
  View,
} from "react-native";
import { JellyfinItem } from "@/scripts/services/jellyfin-api";

interface FocusedItemWidgetProps {
  focusedItem: JellyfinItem | null;
  loading: boolean;
}


export const FocusedItemWidget = ({ focusedItem, loading }: FocusedItemWidgetProps) => {
  return (
    <View style={{
        width: 600,
        height: 100,
     }}>
      <Text style={{ color: "white", fontFamily: "SpaceMono", fontSize: 38, fontWeight: "bold" }}>
        {loading
          ? "Loading..."
          : focusedItem
          ? focusedItem.AlbumArtist
          : "No item focused"}
      </Text>
      <Text style={{ color: "white", fontFamily: "SpaceMono", fontSize: 20, }}>
        {loading
          ? "Loading..."
          : focusedItem
          ? focusedItem.Name
          : "No item focused"}
      </Text>
      <Text style={{ color: "white", fontFamily: "SpaceMono", fontSize: 20,  }}>
        {loading
          ? "Loading..."
          : focusedItem
          ? focusedItem.Id
          : "No item focused"}
      </Text>
    </View>
  );
};