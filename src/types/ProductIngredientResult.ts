export interface IngredientResult {
    name: string
    percent: number
    level: "avoid" | "warning" | "ok"
}

export interface ProductResult {
    name: string
    brandName: string
    imageURI: string
    overallResultLevel: "avoid" | "warning" | "ok"
    overallResultText: string
    ingredients: IngredientResult[]
}