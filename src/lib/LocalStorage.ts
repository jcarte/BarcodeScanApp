import AssetManager from "../../assets/AssetManager"
import { TriggerData } from "../types/TriggerData"

export async function setHasCompletedOnboardingAsync(hasCompleted: boolean): Promise<void> {
    console.log("LS: Save onboarding: ", hasCompleted)
}

export async function getHasCompletedOnboardingAsync(): Promise<boolean> {
    return false
}

export async function getTriggerIngredientsAsync(): Promise<TriggerData[]> {
     const defaultCats:{categoryName:string, highFodmap:boolean}[] = AssetManager.data.categoryList

     const defaultData: TriggerData[] = defaultCats.map(c=> {
        const td: TriggerData = {name: c.categoryName, selected: c.highFodmap}
        return td
    })

    return defaultData
}

export async function setTriggerIngredientsAsync(triggers: TriggerData[]): Promise<void> {
    console.log("LS: Save triggers: ", JSON.stringify(triggers))
}