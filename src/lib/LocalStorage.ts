import AsyncStorage from "@react-native-async-storage/async-storage"
import AssetManager from "../../assets/AssetManager"
import { TriggerData } from "../types/TriggerData"

const ONBOARDING_COMPLETE_KEY = "onboarding-complete"
const TRIGGER_INGREDIENTS_KEY = "trigger-ingredients"

export async function setHasCompletedOnboardingAsync(hasCompleted: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, String(hasCompleted));
    } catch (e) {
        console.log("LS: Save onboarding failed: ", e)
    }
}

export async function getHasCompletedOnboardingAsync(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        if (value != null) {
            return Boolean(value)
        }

        return false//default

    } catch (e) {
        console.log("LS: Get onboarding failed: ", e)
    }
}

export async function setTriggerIngredientsAsync(triggers: TriggerData[]): Promise<void> {
    try {
        const jsonValue = JSON.stringify(triggers);
        await AsyncStorage.setItem(TRIGGER_INGREDIENTS_KEY, jsonValue);
    } catch (e) {
        console.log("LS: Save triggers failed: ", e)
    }
}

export async function getTriggerIngredientsAsync(): Promise<TriggerData[]> {

    //try get from storage
    try {
        const jsonValue = await AsyncStorage.getItem(TRIGGER_INGREDIENTS_KEY);
        if (jsonValue != null)
            return JSON.parse(jsonValue)
    } catch (e) {
        console.log("LS: Get triggers failed: ", e)
    }

    //if fail, get defaults
    const defaultCats: { categoryName: string, highFodmap: boolean }[] = AssetManager.data.categoryList

    const defaultData: TriggerData[] = defaultCats.map(c => {
        const td: TriggerData = { name: c.categoryName, selected: c.highFodmap }
        return td
    })

    return defaultData
}
