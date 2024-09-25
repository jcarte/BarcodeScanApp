import React from "react";

import { View, Image, ViewStyle } from "react-native";
import CustomText from "../core/CustomText";
import { ResultsIconComponent } from "./ResultsIconComponent";
import GlobalStyles from "../../lib/GlobalStyles";


interface ResultsHeaderComponentProps {
    imageUri: string,
    nameText: string,
    brandText: string,
    resultLevel: "avoid" | "warning" | "ok",
    resultText: string,
    style?: ViewStyle,
}

export function ResultsHeaderComponent({ imageUri, nameText, brandText, resultLevel, resultText, style = {} }: ResultsHeaderComponentProps): React.JSX.Element {
    return (
        <View style={style}>
            <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    {
                        imageUri
                            ? <Image style={{ flex: 1, borderRadius: 8, backgroundColor: GlobalStyles.colours.lightGray }} source={{ uri: imageUri }} resizeMode='cover' />
                            : <Image style={{ flex: 1, borderRadius: 8, backgroundColor: GlobalStyles.colours.lightGray }} resizeMode='cover' />
                    }

                </View>
                <View style={{ flex: 2, paddingLeft: 10 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <View style={{}}>
                            <CustomText variant="subheading">{nameText}</CustomText>
                        </View>
                        <View style={{}}>
                            <CustomText color="gray">{brandText}</CustomText>
                        </View>
                        <View style={{ flexGrow: 1 }}>
                            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <ResultsIconComponent style={{ marginRight: 7 }} level={resultLevel} size={20} />
                                    <CustomText fontSize={16} weight="bold" style={{ marginRight: 5 }}>{resultText}</CustomText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}