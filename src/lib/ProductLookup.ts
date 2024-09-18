import { IngredientInfo, ProductInfo, ProductLookupResult } from "../types/ProductLookupResult";


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
        }
    */
function GetIngredient(o: any): IngredientInfo[] {
    //does it have subingredients? Want all the lowest level ings
    if (o.ingredients) {
        return o.ingredients.flatMap(i => GetIngredient(i))
    }

    const perc = ((o.percent_min + o.percent_max) / 2)/100

    const ing:IngredientInfo = {
        id: o.id.split(":")[1], //e.g. "cow-milk"
        name: o.id.split(":")[1].replaceAll('-', ' '), //e.g. "cow milk"
        percent: perc,
    }

    ing.name = ing.name[0].toUpperCase() + ing.name.substring(1).toLowerCase()

    return [ing]
}

/*
    Maps all ingredients to desired format
    Aggregates duplicates together, adding up estimated %
    Applies a threshold for % to be "high" status, downgrades
    any high ings to med if below % threshold
*/
function GetIngredients(o: any): IngredientInfo[] {
    const ingr = GetIngredient(o);

    var result = [];
    ingr.reduce(function (res, value) {
        if (!res[value.id]) {
            res[value.id] =
            {
                id: value.id,
                name: value.name,
                percent: 0//set to zero as adding percent on at next step
            };
            result.push(res[value.id]);
        }
        res[value.id].percent += value.percent;
        return res;
    }, {});

    //rebase percent as they're only an estimate and usually don't add up to 100%
    const sumOfPercent = result.reduce((partialSum, a) => partialSum + a.percent, 0);
    console.log("PL: sum of percent before: ", sumOfPercent)
    result = result.map((i: IngredientInfo) => {
        i.percent = (i.percent / sumOfPercent)
        return i;
    });

    console.log("PL: check on new sum of percent", result.reduce((partialSum, a) => partialSum + a.percent, 0))

    return result;
}


export async function FindProductByBarcode(barcode: string): Promise<ProductLookupResult> {

    //Call OFF API
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}`//Staging = .net, Prod = .org
    var response: Response, json

    try {
        response = await fetch(url)
        json = await response.json();
    } catch (error) {
        return { //call errored
            isSuccess: false,
            status: "Errored",
            product: null,
        }
    }

    //Check error returned
    if (!response.ok) {
        if (response.status >= 500)
            return {//likely server error
                isSuccess: false,
                status: "Errored",
                product: null,
            }
        return {//likely 404
            isSuccess: false,
            status: "NotFound",
            product: null,
        }
    }

    //Check for incomplete json
    if (!json?.product || (typeof json.product.ingredients === 'undefined') || json.product.ingredients.length === 0) {
        return {//likely 404
            isSuccess: false,
            status: "FoundIncomplete",
            product: null,
        }
    }

    let product: ProductInfo = {
        name: json.product.product_name,
        brandName: json.product.brands,
        imageURI: json.product.image_url,
        ingredients: GetIngredients(json.product)
    }

    return {//likely 404
        isSuccess: true,
        status: "FoundComplete",
        product: product,
    }
}