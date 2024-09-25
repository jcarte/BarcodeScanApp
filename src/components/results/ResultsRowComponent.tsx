import React from "react";
import { View } from "react-native";
import * as Progress from 'react-native-progress';
import GlobalStyles from "../../lib/GlobalStyles";
import CustomText from "../core/CustomText";
import { ResultsIconComponent } from "./ResultsIconComponent";
import { IngredientResult } from "../../types/ProductIngredientResult";

interface ResultsRowProps {
    ingredient: IngredientResult
}

export function ResultsRowComponent({ ingredient }: ResultsRowProps): React.JSX.Element {

    const colour = ingredient.level === "avoid"
        ? GlobalStyles.colours.red
        : ingredient.level === "warning"
            ? GlobalStyles.colours.amber
            : GlobalStyles.colours.lightGreen

    const percentText = ingredient.percent < 0.01
        ? "<1%"
        : ingredient.percent.toLocaleString(undefined, { style: "percent", maximumFractionDigits: 0, })
    return (

        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", borderWidth: 0, height: "auto" }}>
            <View style={{ flex: 1, borderWidth: 0 }}>
                <CustomText>{ingredient.name}</CustomText>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 2, paddingLeft: 10 }}>
                    <View style={{
                        transform: [
                            { scaleX: -1 }
                        ]
                    }}>
                        <Progress.Bar
                            progress={ingredient.percent}
                            width={null}
                            height={10}
                            borderRadius={10}
                            borderWidth={0}
                            color={colour}
                            unfilledColor={GlobalStyles.colours.lightGray} />
                    </View>
                </View>

                <View style={{ flexShrink: 1, width: 50, paddingLeft: 10, }}>
                    <CustomText color="gray" textAlign="center">{percentText}</CustomText>
                </View>
                <View style={{ flexShrink: 1, paddingLeft: 10 }}>
                    <ResultsIconComponent level={ingredient.level} size={12} />
                </View>
            </View>
        </View>



    )
}