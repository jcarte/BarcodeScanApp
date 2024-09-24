import React from 'react';
import { BarcodeScannerComponent } from '../components/scanning/BarcodeScannerComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FindProductByBarcode } from '../lib/ProductLookup';
import { GetResultsAsync } from '../lib/ResultsHandler';
import { ResultsDrawerComponent } from '../components/results/ResultsDrawerComponent';
import { ProductResult } from '../types/ProductIngredientResult';

export default function ScanScreen({ navigation }): React.JSX.Element {

    const [lastBarcode, setLastBarcode] = React.useState<string>("")//save last successful barcode
    const [isResultsVisible, setIsResultsVisible] = React.useState<boolean>(false)
    const [resultsType, setResultsType] = React.useState<"NotFound" | "Found">("NotFound")
    const [result, setResult] = React.useState<ProductResult | null>(null)
    const [isResultsExpanded, setIsResultsExpanded] = React.useState<boolean>(false)

    const handleBarCode = async (bc): Promise<void> => {
        console.log("SS: HandleBarcode: ", bc)

        if (bc === lastBarcode) {
            console.log("SS: HandleBarcode: Same barcode, skipping")
            return
        }

        if (isResultsExpanded) {
            console.log("SS: HandleBarcode: Results expanded, skipping")
            return
        }

        const productLookup = await FindProductByBarcode(bc)

        setIsResultsVisible(true)//always show regardless of result, starts hidden, shows after first result

        if (!productLookup.isSuccess || !productLookup.product) {
            setResultsType("NotFound")
            setResult(null)
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

        setResultsType("Found")
        setResult({
            brandName: productLookup?.product?.brandName,
            imageURI: productLookup?.product?.imageURI,
            name: productLookup?.product?.name,
            overallResultLevel: resultLevel,
            overallResultText: resultText,
            ingredients: ings
        })
        setLastBarcode(bc)

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ResultsDrawerComponent
                resultsType={resultsType}
                isVisible={isResultsVisible}
                onExpandCollapse={(isResultsExpanded) => { setIsResultsExpanded(isResultsExpanded) }}
                backgroundComponent={
                    <BarcodeScannerComponent
                        onBarCodeScanned={handleBarCode}
                        refreshIntervalMS={750}
                        timeoutAfterScanMS={3000}
                    />
                }
                result={result}
            />
        </SafeAreaView>
    )
}