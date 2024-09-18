import React from "react";

import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import { View, ViewStyle } from "react-native";
import GlobalStyles from "../../lib/GlobalStyles";


interface ResultsIconProps {
    level: "avoid" | "warning" | "ok",
    size: number,
    style?: ViewStyle
}

export function ResultsIconComponent({ level, style = {}, size = 12 }: ResultsIconProps): React.JSX.Element {
    const colour = level === "avoid"
        ? GlobalStyles.colours.red
        : level === "warning"
            ? GlobalStyles.colours.amber
            : GlobalStyles.colours.lightGreen

    return (
        <View style={style}>
            {level === "avoid" && <Entypo name="circle-with-cross" size={size * 1.1} color={colour} />}
            {level === "warning" && <Entypo name="warning" size={size} color={colour} />}
            {level === "ok" && <Octicons name="check-circle-fill" size={size} color={colour} />}
        </View>
    )
}