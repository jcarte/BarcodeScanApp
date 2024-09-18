import React, { useEffect, useRef } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from "react-native";
import { ResultsListComponent } from "./ResultsListComponent";
import { ResultsHeaderComponent } from "./ResultsHeaderComponent";
import BottomSheetComponent from "../BottomSheetComponent";
import GlobalStyles from "../../lib/GlobalStyles";
import { ProductResult } from "../../types/ProductIngredientResult";
import { NotFoundHeaderComponent } from "./NotFoundHeaderComponent";

export interface ResultsDrawerComponentProps {
    resultsType: "NotFound" | "Found"
    isVisible: boolean,
    backgroundComponent: React.ReactNode

    result: ProductResult | null
}


export function ResultsDrawerComponent({
    resultsType = "NotFound",
    isVisible = false,

    result = null,
    backgroundComponent }: ResultsDrawerComponentProps): React.JSX.Element {

    const sheetRef = useRef(null);

    const collapsedHeight = 200
    const expandedHeight = (resultsType === "Found") ? "89%" : collapsedHeight
    const isDragEnabled = (resultsType === "Found") ? true : false

    useEffect(() => {
        if (isVisible)
            sheetRef.current.open()
        else
            sheetRef.current.close()
    }, [isVisible])


    return (
        <View style={{ flex: 1}}>
            <View style={{ flex: 1, backgroundColor: "lightgray" }}>
                {backgroundComponent}
            </View>
            <BottomSheetComponent
                collapsedHeight={collapsedHeight}
                expandedHeight={expandedHeight}
                //   onChange={handleSheetChanges}
                ref={sheetRef}
                startsOpen={false}
                isDragEnabled={isDragEnabled}
                headerComponent={() => (
                    resultsType === "Found"
                        ? (<ResultsHeaderComponent
                            imageUri={result?.imageURI ?? ""}
                            nameText={result?.name ?? ""}
                            brandText={result?.brandName ?? ""}
                            resultLevel={result?.overallResultLevel}
                            resultText={result?.overallResultText ?? ""}
                            style={{ padding: 20, height: 175, flex: 1 }}
                        />)
                        : (<NotFoundHeaderComponent style={{ padding: 20, height: 175, flex: 1 }} />))
                }
            >
                <View style={{ flex: 1 }}>
                    {/* Divider */}
                    <View style={{ marginHorizontal: 20, height: 1, borderBottomWidth: 1, borderColor: GlobalStyles.colours.lightGray }} />
                    <ResultsListComponent
                        ingredients={result?.ingredients ?? []}
                        style={{ paddingHorizontal: 20 }}
                    />
                </View>
            </BottomSheetComponent>
        </View>
    )
}
