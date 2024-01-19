

export class ProductHandler {
    ingList = []
    constructor()
    {
        console.log("PH: constructor running")

        this.ingList = require('./FodmapIngredientList.json')

        console.log("PH: constructor run")
    }


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
    GetIngredient(o) {
        if(o.ingredients)
        {
            return o.ingredients.flatMap(i => this.GetIngredient(i))
        }
        return {
            name: o.id.split(":")[1],
            percent: o.percent_estimate,
            fodmapStatus: this.ingList.find(i => i.name == o.id.split(":")[1])?.score
        }
    }

    /*
        Maps all ingredients to desired format
        Aggregates duplicates together, adding up estimated %
        Applies a threshold for % to be "high" status, downgrades
        any high ings to med if below % threshold
    */
    GetIngredients(o) {
        const ingr = this.GetIngredient(o)

        var result = [];
        ingr.reduce(function(res, value) 
        {
            if (!res[value.name]) 
            {
                res[value.name] = 
                { 
                    name: value.name, 
                    fodmapStatus: (value.fodmapStatus === undefined) ? 'unknown' : value.fodmapStatus, //just take first fodmap if can't find
                    percent: 0 
                };
                result.push(res[value.name])
            }
            res[value.name].percent += value.percent;
            return res;
        }, {});

        //downgrade from high to med if only a small amount
        result = result.map((i)=>
        {
            if(i.fodmapStatus === "high" && i.percent < 5)
            {
                i.fodmapStatus = "medium"
            }
            return i
        })

        return result
    }


    /*
        status: error | notFound | incomplete | ok
    */
    async FetchProduct( barcode ) {
        console.log("PH: fetch barcode:", barcode)

        const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}`
        var response, json

        try {
            response = await fetch(url)
            json = await response.json();    
        } catch (error) {
            return {
                status: "error",
                product: null,
            }
        }
        
        ////FOR TESTING
        //const json = require('./example_product.json')

        if(!response.ok){
            return {
                status: "notFound",
                product: null,
            }
        }
            
        if(typeof json.product.ingredients === 'undefined' || json.product.ingredients.length === 0)
        {
            return {
                status: "incomplete",
                product: null,
            }
        }


        let prod = {
            barcode: barcode,
            name: json.product.product_name,
            brand: json.product.brands,
            imgUrl: json.product.image_url,
            ingredients: this.GetIngredients(json.product)
        }

        //Determine overall product status based on ingredients
        if (prod.ingredients.some((i) => i.fodmapStatus === 'high')){
            prod.fodmapStatus = "high"
        }
        else if (prod.ingredients.some((i) => i.fodmapStatus === 'medium')){
            prod.fodmapStatus = "medium"
        }
        else if (prod.ingredients.some((i) => i.fodmapStatus === 'low')){
            prod.fodmapStatus = "low"
        }
        else {
            prod.fodmapStatus = "unknown"
        }


        //form up into searchresults object
        return {
            status: "ok",
            product: prod,
        }
    }
}