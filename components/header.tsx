import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useDrawer } from "./DrawerProvider";

interface HeaderProps {
  page?: string;
  pageType?: string;
  pageTitle?: string;
}

export default function Header({ page, pageType, pageTitle }: HeaderProps) {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  return (
    <>
      <View
        style={[
          page === "playing" || page === "home"
            ? { position: "absolute", zIndex: 10, width: "100%", opacity: 1, mixBlendMode: "difference", marginTop: 4 //Temporary fix for logo mispositioning when in playing page
                }
            : {},
          {
            backgroundColor: "transparent",
            paddingTop: 20,
            paddingBottom: 15,
            paddingLeft: page === "playing" || page === "home" ? 40 : 80,
            paddingRight: page === "playing" || page === "home" ? 40 : 80,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        {/* TODO: Judge if the logo is a button that opens either the menu or is conditionally different based on the current page */}
        <TouchableOpacity onPress={() => openDrawer()}>
          <Image
            source={require("../assets/images/finale-logo.svg")}
            style={{ width: 150, height: 10, bottom: 0, left: 0, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        {page === "playing" || page === "home" ? null : (
          <Text
            style={{
              color: "#9c9c9cff",
              fontFamily: "SpaceMono",
            }}
          >
            Explorer View
          </Text>
        )}
      </View>
      {page === "playing" || page === "home" ? null : (
        <View
          style={{
            backgroundColor: "#171717",
            borderBottomColor: "#454545",
            borderBottomWidth: 2,
            marginLeft: 80,
            marginRight: 80,
          }}
        />
      )}
    </>
  );
}
