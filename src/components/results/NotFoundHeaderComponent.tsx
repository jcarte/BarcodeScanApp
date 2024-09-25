import React from "react";

import { View, Image, ViewStyle } from "react-native";
import CustomText from "../core/CustomText";
import GlobalStyles from "../../lib/GlobalStyles";


interface NotFoundHeaderComponentProps {
    imageUri?: string,
    style?: ViewStyle,
}

export function NotFoundHeaderComponent({ style = {}, imageUri = "" }: NotFoundHeaderComponentProps): React.JSX.Element {

    const TITLE_TEXT = "Unknown Product"
    const BOTTOM_TEXT = "Sorry, we don't know this product yet"

    return (
        <View style={style}>
            <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Image style={{ flex: 1, borderRadius: 8, backgroundColor: GlobalStyles.colours.lightGray }} src={imageUri} resizeMode='cover' />
                </View>
                <View style={{ flex: 2, paddingLeft: 10 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <View style={{}}>
                            <CustomText variant="subheading">{TITLE_TEXT}</CustomText>
                        </View>
                        <View style={{ flexGrow: 1, }}>
                            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CustomText fontSize={16}>{BOTTOM_TEXT}</CustomText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}