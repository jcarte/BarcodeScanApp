import * as React from "react"
import { StyleSheet, View } from "react-native"

/** Outline of a barcode to place in the middle of the screen */
export function BarcodeBoxGuideComponent(): React.ReactNode {
    return (
        <View style={styles.grid_container}>
            <View style={{ flex: 3, borderWidth: 0, }}></View>
            <View style={{ flex: 2, borderWidth: 0, flexDirection: 'row' }}>
                <View style={{ flex: 1, borderWidth: 0, }}></View>
                <View style={{ flex: 6, borderWidth: 0, flexDirection: 'row' }}>
                    <View style={{ flex: 1, borderWidth: 0, justifyContent: "space-between" }}>
                        <View style={styles.grid_tl}></View>
                        <View style={styles.grid_bl}></View>
                    </View>
                    <View style={{ flex: 1, borderWidth: 0, justifyContent: "space-between", alignItems: "flex-end" }}>
                        <View style={styles.grid_tr}></View>
                        <View style={styles.grid_br}></View>
                    </View>
                </View>
                <View style={{ flex: 1, borderWidth: 0, }}></View>
            </View>
            <View style={{ flex: 3, borderWidth: 0, }}></View>
        </View>

    )
}

const outlineThickness = 2
const outlineSize = 30
const outlineColor = "white"
const outlineBorderRadius = 15

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid_container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 0,
    flex: 1,
  },

  grid_tl: {
    height: outlineSize,
    width: outlineSize,
    borderColor: outlineColor,
    borderTopWidth: outlineThickness,
    borderLeftWidth: outlineThickness,
    borderTopLeftRadius: outlineBorderRadius
  },

  grid_bl: {
    height: outlineSize,
    width: outlineSize,
    borderColor: outlineColor,
    borderBottomWidth: outlineThickness,
    borderLeftWidth: outlineThickness,
    borderBottomLeftRadius: outlineBorderRadius
  },

  grid_tr: {
    height: outlineSize,
    width: outlineSize,
    borderColor: outlineColor,
    borderTopWidth: outlineThickness,
    borderRightWidth: outlineThickness,
    borderTopRightRadius: outlineBorderRadius
  },

  grid_br: {
    height: outlineSize,
    width: outlineSize,
    borderColor: outlineColor,
    borderBottomWidth: outlineThickness,
    borderRightWidth: outlineThickness,
    borderBottomRightRadius: outlineBorderRadius
  },

});