import React from 'react';
import { BarcodeScannerComponent } from '../components/scanning/BarcodeScannerComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FindProductByBarcode } from '../lib/ProductLookup';
import { GetResultsAsync } from '../lib/ResultsHandler';
import { ResultsDrawerComponent } from '../components/results/ResultsDrawerComponent';
import { ProductResult } from '../types/ProductIngredientResult';
import { Analytics } from '../lib/Analytics';
import { View } from 'react-native';
import { LoadingComponent } from '../components/core/LoadingComponent';

export default function ScanScreen({ navigation }): React.JSX.Element {

    const [lastBarcode, setLastBarcode] = React.useState<string>("")//save last successful barcode
    const [isResultsVisible, setIsResultsVisible] = React.useState<boolean>(false)
    const [resultsType, setResultsType] = React.useState<"NotFound" | "Found">("NotFound")
    const [result, setResult] = React.useState<ProductResult | null>(null)
    const [isResultsExpanded, setIsResultsExpanded] = React.useState<boolean>(false)
    const [barcodeImage, setBarcodeImage] = React.useState<string>("")//picture taken at moment of detecting barcode
    const [isProcessingBarcode, setIsProcessingBarcode] = React.useState<boolean>(false)//picture taken at moment of detecting barcode

    const analytics = new Analytics()

    const handleBarCode = async (barcode, imageUri): Promise<void> => {
        console.log("SS: HandleBarcode: ", barcode)

        if (isProcessingBarcode) {
            console.log("SS: HandleBarcode: Processing other barcode, skipping")
            return
        }

        if (barcode === lastBarcode) {
            console.log("SS: HandleBarcode: Same barcode, skipping", lastBarcode)
            return
        }

        if (isResultsExpanded) {
            console.log("SS: HandleBarcode: Results expanded, skipping")
            return
        }

        setIsProcessingBarcode(true)//turn on loading animation
        setLastBarcode(barcode)

        console.log("SS: try to find product from barcode")
        const productLookup = await FindProductByBarcode(barcode)
        console.log("SS: got product results")

        //Fail condition
        if (!productLookup.isSuccess || !productLookup.product) {
            const analyticsStatus =
                productLookup.status === "Errored" ? "error" :
                    productLookup.status === "FoundIncomplete" ? "incomplete" : "notFound"
            analytics.logBarcodeScanned(barcode, analyticsStatus)

            setResultsType("NotFound")
            setBarcodeImage(imageUri)
            setResult(null)
            setIsResultsVisible(true)//always show regardless of result, starts hidden, shows after first result
            setIsProcessingBarcode(false)
            return
        }

        const ings = await GetResultsAsync(productLookup.product.ingredients)

        const avoidCount = ings.filter(i => i.level === "avoid").length
        const warningCount = ings.filter(i => i.level === "warning").length
        // const okCount = ings.filter(i => i.level === "ok").length

        const resultLevel: "avoid" | "warning" | "ok" = avoidCount > 0
            ? "avoid"
            : warningCount > 0
                ? "warning"
                : "ok"

        const resultText = avoidCount > 0
            ? `${avoidCount} trigger(s) found`
            : warningCount > 0
                ? `${warningCount} potential trigger(s) found`
                : "No trigger(s) found"

        analytics.logBarcodeScanned(barcode, "ok", resultLevel)//log to analytics

        setResultsType("Found")
        setResult({
            brandName: productLookup?.product?.brandName,
            imageURI: productLookup?.product?.imageURI,
            name: productLookup?.product?.name,
            overallResultLevel: resultLevel,
            overallResultText: resultText,
            ingredients: ings
        })
        setBarcodeImage("")//don't store as not needed for successful result
        setIsResultsVisible(true)//always show regardless of result, starts hidden, shows after first result
        setIsProcessingBarcode(false)//stop loading animation
    }

    function handleDrawerExpandOrCollapse(isResultsExpanded: boolean) {
        setIsResultsExpanded(isResultsExpanded)

        isResultsExpanded
            ? analytics.logBottomSheetExpanded()
            : analytics.logBottomSheetCollapsed()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ResultsDrawerComponent
                resultsType={resultsType}
                isVisible={isResultsVisible}
                onExpandCollapse={handleDrawerExpandOrCollapse}
                backgroundComponent={
                    <View style={{ flex: 1 }}>
                        <BarcodeScannerComponent
                            onBarCodeScanned={handleBarCode}
                            refreshIntervalMS={750}
                            timeoutAfterScanMS={3000}
                        />
                        {isProcessingBarcode &&
                            <LoadingComponent style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%"
                            }} />}
                    </View>
                }
                imageURI={resultsType == "Found" ? result?.imageURI : barcodeImage}
                productName={result?.name}
                productBrand={result?.brandName}
                resultLevel={result?.overallResultLevel}
                resultText={result?.overallResultText}
                ingredients={result?.ingredients}
            />
        </SafeAreaView>
    )
}