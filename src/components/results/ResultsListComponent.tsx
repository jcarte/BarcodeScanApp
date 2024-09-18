import React from "react";
import { SectionList, View, ViewStyle } from "react-native";
import { ResultsRowComponent } from "./ResultsRowComponent";
import { ResultsIconComponent } from "./ResultsIconComponent";
import CustomText from "../core/CustomText";
import GlobalStyles from "../../lib/GlobalStyles";
import { FlatList } from "react-native-gesture-handler";
import { IngredientResult } from "../../types/ProductIngredientResult";

export interface ResultsListComponentProps {
    ingredients: IngredientResult[]
    style?: ViewStyle
}

export function ResultsListComponent({ ingredients, style = {} }: ResultsListComponentProps): React.JSX.Element {

    ingredients.sort((a, b) => b.percent - a.percent)

    const sections = [
        { title: "Known Triggers", ingredients: ingredients.filter(t => t.level === "avoid") },
        { title: "Potential Triggers", ingredients: ingredients.filter(t => t.level === "warning") },
        { title: "Non-Triggers", ingredients: ingredients.filter(t => t.level === "ok") },
    ]

    return (
        <FlatList
            data={sections}
            renderItem={({ item }) => {
                return (
                    <View style={style}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}>
                            <View style={{ paddingRight: 7, paddingLeft: 0 }}>
                                {item.title === "Known Triggers" && <ResultsIconComponent level="avoid" size={19} />}
                                {item.title === "Potential Triggers" && <ResultsIconComponent level="warning" size={19} />}
                                {item.title === "Non-Triggers" && <ResultsIconComponent level="ok" size={19} />}
                            </View>
                            <CustomText
                                variant="heading"
                                style={{ marginBottom: 0 }}>
                                {item.ingredients.length} {item.title}
                            </CustomText>
                        </View>
                        <FlatList
                            data={item.ingredients}
                            renderItem={({ item }) => {
                                const ing = item
                                return (
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 10, borderColor: GlobalStyles.colours.lightGray, borderBottomWidth: 1 }}>
                                        <ResultsRowComponent ingredient={ing} />
                                    </View>
                                )
                            }}
                        />
                    </View>
                )
            }}
        />

    )
}
