export interface IngredientInfo {
    id: string
    name: string
    percent: number
}

export interface ProductInfo {
    name: string
    brandName: string
    imageURI: string
    ingredients: IngredientInfo[]
}

export interface ProductLookupResult {
    isSuccess: boolean
    status: "NotFound" | "FoundIncomplete" | "FoundComplete" | "Errored"
    product?: ProductInfo
}