import React, { useState} from 'react';

export type ProductResults = {
    status: string,
    product: Product,
    errorMessage: string,
}

export type Product = {
    barcode: string,
    name: string,
    brand: string,
    imgUrl: string,
    fodmapStatus: FodmapStatus,
    ingredients: Ingredient[]
}

export type Ingredient = {
    id: string,
    name: string, 
    fodmapStatus: FodmapStatus,
    percent: number
}

export type FodmapLookup = {
    name: string, 
    score: string
}

export enum FodmapStatus {
    Unknown = 0,
    Low = 1,
    Medium = 2,
    High = 3
  }

export const FetchProduct = async (barcode): Promise<ProductResults> => {
    console.log("PH: Starting")

    var ingList: FodmapLookup[] = []
    ingList = require('../../assets/data/FodmapIngredientList.json')

    /*
        Map an individual ingredient to the format we need and lookup its fodmap status.
        Strips language from ing id, uses that as id going forward
        Also recurses down ingredients hierarchy (ings can be made of ings) and gets
        the lowest level
        example input format:
        {
            "id": "en:cheese-and-onion-flavour-potato-crisps-ingredients",
            "ingredients": [
                {
                    "ciqual_food_code": "4003",
                    "id": "en:potato",
                    "percent_estimate": 52.6315789473684,
                    "percent_max": 100,
                    "percent_min": 5.26315789473684,
                    "text": "Potatoes",
                    "vegan": "yes",
                    "vegetarian": "yes"
                }
            ],
            "percent_estimate": 52.6315789473684,
            "percent_max": 100,
            "percent_min": 5.26315789473684,
            "text": "Cheese and Onion Flavour Potato Crisps Ingredients"
        },

        example output:
        {
            "name": "potato",
            "percent": 52...
            "fodmapStatus": "low"
        }
    */
    function GetIngredient (o: any) : Ingredient[] 
    {
        if(o.ingredients)
        {
            return o.ingredients.flatMap(i => GetIngredient(i))
        }

        const perc = (o.percent_min+o.percent_max)/2
        const fodStatusText = ingList.find(i => i.name == o.id.split(":")[1])?.score
        let fodStatus = FodmapStatus.Unknown

        switch (fodStatusText) {
            case "low":
                fodStatus = FodmapStatus.Low
                break;
            case "medium":
                fodStatus = FodmapStatus.Medium
                break;
            case "high":
                fodStatus = FodmapStatus.High
                break;
            default:
                break;
        }

        return [{
            id: o.id.split(":")[1],//e.g. "cow-milk"
            name: o.id.split(":")[1].replaceAll('-',' '), //e.g. "cow milk"
            percent: perc,
            fodmapStatus: fodStatus
        }]
    }

    /*
        Maps all ingredients to desired format
        Aggregates duplicates together, adding up estimated %
        Applies a threshold for % to be "high" status, downgrades
        any high ings to med if below % threshold
    */
    function GetIngredients(o: any): Ingredient[] 
    {
        const ingr = GetIngredient(o);

        var result = [];
        ingr.reduce(function (res, value) {
            if (!res[value.id]) {
                res[value.id] =
                {
                    id: value.id,
                    name: value.name,
                    fodmapStatus: value.fodmapStatus,
                    percent: 0//set to zero as adding percent on at next step
                };
                result.push(res[value.id]);
            }
            res[value.id].percent += value.percent;
            return res;
        }, {});

        //downgrade from high to med if only a small amount
        result = result.map((i:Ingredient) => {
            //console.log(i.name," - ",i.fodmapStatus, " - ", i.percent)
            if (i.fodmapStatus === FodmapStatus.High && i.percent < 5) {
                i.fodmapStatus = FodmapStatus.Medium;
            }
            return i;
        });

        //rebase percent as they're only an estimate and usually don't add up to 100%
        const sumOfPercent = result.reduce((partialSum, a) => partialSum + a.percent, 0);
        console.log("PH: sum of percent before: ",sumOfPercent)
        result = result.map((i:Ingredient) => {
            i.percent = (i.percent / sumOfPercent) * 100
            return i;
        });

        console.log("PH: check on new sum of percent", result.reduce((partialSum, a) => partialSum + a.percent, 0))

        return result;
    }


    /*
        status: error | notFound | incomplete | ok
    */
    //FetchProduct = async (barcode) => {

    console.log("PH: fetch barcode:", barcode)

    //Staging = .net, Prod = .org
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}`
    var response, json

    try {
        response = await fetch(url)
        json = await response.json();    
    } catch (error) {
        return {
            status: "error",
            product: null,
            errorMessage: error.message
        }
    }
    
    ////FOR TESTING
    //const json = require('../../assets/data/example_product.json')

    if(!response.ok){
        return {
            status: "notFound",
            product: null,
            errorMessage: "",
        }
    }
        
    if(typeof json.product.ingredients === 'undefined' || json.product.ingredients.length === 0)
    {
        return {
            status: "incomplete",
            product: null,
            errorMessage: "",
        }
    }


    let prod: Product = {
        barcode: barcode,
        name: json.product.product_name,
        brand: json.product.brands,
        imgUrl: json.product.image_url,
        fodmapStatus: FodmapStatus.Unknown,
        ingredients: GetIngredients(json.product)
    }

    prod.fodmapStatus = Math.max.apply(Math, prod.ingredients.map((i)=>i.fodmapStatus))
    


    //Exclude ingredients with an unknown status
    //prod.ingredients = prod.ingredients.filter(i => i.fodmapStatus !== FodmapStatus.Unknown)

    //form up into searchresults object
    return {
        status: "ok",
        product: prod,
        errorMessage: "",
    }
    
}
