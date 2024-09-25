import React, { useEffect, useRef } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { ResultsListComponent } from "./ResultsListComponent";
import { ResultsHeaderComponent } from "./ResultsHeaderComponent";
import BottomSheetComponent from "../core/BottomSheetComponent";
import GlobalStyles from "../../lib/GlobalStyles";
import { IngredientResult } from "../../types/ProductIngredientResult";
import { NotFoundHeaderComponent } from "./NotFoundHeaderComponent";

export interface ResultsDrawerComponentProps {
    resultsType: "NotFound" | "Found"
    isVisible: boolean
    backgroundComponent: React.ReactNode
    onExpandCollapse?: (isExpanded: boolean) => void
    imageURI: string
    productName?: string
    productBrand?: string
    resultLevel?: "avoid" | "warning" | "ok" | null
    resultText?: string
    ingredients?: IngredientResult[]
}


export function ResultsDrawerComponent({
    resultsType = "NotFound",
    isVisible = false,
    onExpandCollapse = () => { },
    backgroundComponent,
    imageURI,
    productName = "",
    productBrand = "",
    resultLevel = null,
    resultText = "",
    ingredients = [],
}: ResultsDrawerComponentProps): React.JSX.Element {

    const sheetRef = useRef(null);

    const [maxHeight, setMaxHeight] = React.useState<number>(400)//wait to get this from the view when it's loaded

    const collapsedHeight = 200
    const expandedHeight = (resultsType === "Found") ? maxHeight * .98 : collapsedHeight
    const isDragEnabled = (resultsType === "Found") ? true : false

    useEffect(() => {
        if (isVisible)
            sheetRef.current.open()
        else
            sheetRef.current.close()
    }, [isVisible])


    return (
        <View style={{ flex: 1 }} onLayout={(event: LayoutChangeEvent) => {
            setMaxHeight(event.nativeEvent.layout.height)//get height of view, to set max expanded height of BS -- could move this logic into BS component
        }}>
            <View style={{ flex: 1, backgroundColor: "lightgray" }}>
                {backgroundComponent}
            </View>
            <BottomSheetComponent
                collapsedHeight={collapsedHeight}
                expandedHeight={expandedHeight}
                onChange={(index: number) => onExpandCollapse?.(index === 1)}
                ref={sheetRef}
                startsOpen={false}
                isDragEnabled={isDragEnabled}
                headerComponent={() => (
                    resultsType === "Found"
                        ? (<ResultsHeaderComponent
                            imageUri={imageURI ?? ""}
                            nameText={productName ?? ""}
                            brandText={productBrand ?? ""}
                            resultLevel={resultLevel}
                            resultText={resultText ?? ""}
                            style={{ padding: 20, height: 175, flex: 1 }}
                        />)
                        : (<NotFoundHeaderComponent
                            imageUri={imageURI ?? ""}
                            style={{ padding: 20, height: 175, flex: 1 }} />))
                }
            >
                {
                    resultsType === "Found" &&
                    <View style={{ flex: 1 }}>
                        {/* Divider */}
                        <View style={{ marginHorizontal: 20, height: 1, borderBottomWidth: 1, borderColor: GlobalStyles.colours.lightGray }} />
                        <ResultsListComponent
                            ingredients={ingredients ?? []}
                            style={{ paddingHorizontal: 20, paddingBottom: 30 }}
                        />
                    </View>
                }
            </BottomSheetComponent>
        </View>
    )
}
