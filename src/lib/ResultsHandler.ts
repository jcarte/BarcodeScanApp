import React from "react"
import { IngredientResult } from "../types/ProductIngredientResult";
import { IngredientInfo } from "../types/ProductLookupResult";
import { getTriggerIngredientsAsync } from "./LocalStorage";
import { TriggerData } from "../types/TriggerData";
import AssetManager from "../../assets/AssetManager";

interface CategoryLookup {
    ingredientName: string,
    categoryName: string
}

export async function GetResultsAsync(ingInfos: IngredientInfo[]): Promise<IngredientResult[]> {

    console.log("RH: Getting triggers")
    const triggers: TriggerData[] = await getTriggerIngredientsAsync()

    console.log("RH: Getting categories")
    const ingCatLookup: CategoryLookup[] = AssetManager.data.ingredientCategoryLookup

    console.log("RH: Getting results")
    const results: IngredientResult[] = ingInfos.map(i => {

        const catLookup: CategoryLookup | null = ingCatLookup.find(c => i.id == c.ingredientName)

        if(!catLookup)//don't know what it is, return warn
        return {
            name: i.name,
            percent: i.percent,
            level: "warning"
        }

        //try to find if they've selected this cat as a trigger
        const trig: TriggerData | null = triggers.find(t => t.name == catLookup.categoryName)

        if(!trig)//Couldn't find trigger (somethings gone wrong), return warn
        return {
            name: i.name,
            percent: i.percent,
            level: "warning"
        }

        const level = trig.selected ? "avoid": "ok"

        return {
            name: i.name,
            percent: i.percent,
            level: level//confusingly call the level and ingredient category both Category... doh...
        }
    })

    console.log("RH: Got results, returning", results)
    return results
}