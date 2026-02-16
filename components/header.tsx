import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { useDrawer } from "./DrawerProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

// TODO: The conditional logic for rendering elements here is really lazy. There could be shorter, more readable logic that defines what elements should be rendered based on what page is being viewed.

export type ViewMode = "flatlist" | "scrollview";

interface HeaderProps {
  page?: string;
  pageType?: string;
  pageTitle?: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onRefresh?: () => void | Promise<void>;
}

export default function Header({ page, pageType, pageTitle, viewMode, onViewModeChange, onRefresh }: HeaderProps) {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  return (
    <>
      <View
        style={[
          page === "playing" || page === "home"
            ? {
                position: "absolute",
                zIndex: 10,
                opacity: 1,
                mixBlendMode: "difference",
                marginTop: 4, //Temporary fix for logo mispositioning when in playing page
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          {/* <Pressable onPress={() => router.back()}>
            <Text style={{ color: "#3C3C3C", fontFamily: "SpaceMono" }}>
              Back
            </Text>
          </Pressable> */}
          <Pressable
            onPress={() => (page === "playing" ? router.back() : openDrawer())}
          >
            {page === "playing" ? (
              <Ionicons
                name="arrow-back-outline"
                size={36}
                style={{ backgroundColor: "black" }}
                color="white"
              />
            ) : (
              <Image
                source={require("../assets/images/finale-logo.svg")}
                style={{
                  width: 150,
                  height: 10,
                  bottom: 0,
                  left: 0,
                  resizeMode: "contain",
                }}
              />
            )}
          </Pressable>
        </View>

        {page === "playing" || page === "home" ? null : (
          <Menu>
            <MenuTrigger
              customStyles={{
                triggerText: { color: "#9c9c9cff", fontFamily: "SpaceMono" },
                TriggerTouchableComponent: Pressable,
                triggerTouchable: {
                  style: ({ hovered }: { hovered?: boolean }) => ({
                    backgroundColor: hovered
                      ? "rgba(128, 128, 128, 0.2)"
                      : "transparent",
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }),
                },
              }}
              text="Explorer View ▾"
            />
            <MenuOptions
              customStyles={{
                optionsContainer: { marginTop: 16 },
                optionsWrapper: { padding: 5 }
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 40, alignSelf: "center" }}
              >
                <MenuOption
                  style={{ flex: 1 }}
                  customStyles={{
                    OptionTouchableComponent: Pressable,
                    optionTouchable: {
                      style: ({ hovered }: { hovered?: boolean }) => ({
                        // Hover style
                      }),
                    },
                    optionWrapper: {
                      backgroundColor:
                        viewMode === "scrollview"
                          ? "rgba(0, 0, 0, 0.06)"
                          : "transparent",
                      borderRadius: 8,
                    },
                  }}
                  onSelect={() => {
                    onViewModeChange?.("scrollview");
                    return false;
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Ionicons
                      name="grid-outline"
                      size={24}
                      color={viewMode === "scrollview" ? "#1a1a1a" : "black"}
                    />
                    <Text
                      style={{
                        color:
                          viewMode === "scrollview" ? "#1a1a1a" : "#9c9c9cff",
                        fontFamily: "SpaceMono",
                        fontWeight:
                          viewMode === "scrollview" ? "600" : "normal",
                      }}
                    >
                      Grid
                    </Text>
                  </View>
                </MenuOption>
                <MenuOption
                  style={{ flex: 1 }}
                  customStyles={{
                    OptionTouchableComponent: Pressable,
                    optionTouchable: {
                      style: ({ hovered }: { hovered?: boolean }) => ({
                        // Hover style
                      }),
                    },
                    optionWrapper: {
                      backgroundColor:
                        viewMode === "flatlist"
                          ? "rgba(0, 0, 0, 0.06)"
                          : "transparent",
                      borderRadius: 8,
                    },
                  }}
                  onSelect={() => {
                    onViewModeChange?.("flatlist");
                    return false;
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Ionicons
                      name="list-outline"
                      size={24}
                      color={viewMode === "flatlist" ? "#1a1a1a" : "black"}
                    />
                    <Text
                      style={{
                        color:
                          viewMode === "flatlist" ? "#1a1a1a" : "#9c9c9cff",
                        fontFamily: "SpaceMono",
                        fontWeight:
                          viewMode === "flatlist" ? "600" : "normal",
                      }}
                    >
                      List
                    </Text>
                  </View>
                </MenuOption>
              </View>
              <MenuOption
                onSelect={() => {
                  void Promise.resolve(onRefresh?.()).then(() => {});
                  return false;
                }}
              >
                <Text
                  style={{
                    color: "#9c9c9cff",
                    fontFamily: "SpaceMono",
                  }}
                >
                  Refresh
                </Text>
              </MenuOption>
              <MenuOption>
                <Text
                  style={{
                    color: "#9c9c9cff",
                    fontFamily: "SpaceMono",
                  }}
                >
                  Filter Options
                </Text>
              </MenuOption>
              <MenuOption>
                <Text
                  style={{
                    color: "#9c9c9cff",
                    fontFamily: "SpaceMono",
                  }}
                >
                  Sort Options
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
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
