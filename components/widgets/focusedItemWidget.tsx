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
    <View style={{ backgroundColor: "lightgray",
     }}>
      <Text style={{ color: "black" }}>
        {loading
          ? "Loading..."
          : focusedItem
          ? focusedItem.AlbumArtist
          : "No item focused"}
      </Text>
      <Text style={{ color: "black" }}>
        {loading
          ? "Loading..."
          : focusedItem
          ? focusedItem.Name
          : "No item focused"}
      </Text>
      <Text style={{ color: "black" }}>
        {loading
          ? "Loading..."
          : focusedItem
          ? focusedItem.Id
          : "No item focused"}
      </Text>
    </View>
  );
};