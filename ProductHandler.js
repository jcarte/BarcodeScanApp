

export class ProductHandler {
    ingList = []
    constructor()
    {
        console.log("constructor running")

        this.ingList = require('./FodmapIngredientList.json')

        console.log("constructor run")
    }

    async FetchProduct( barcode ) {

        console.log("barcode:", barcode)
        //console.log("inglist", this.ingList)

        //https://world.openfoodfacts.org/api/v2/product/01041859.json
        
        const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}`
        console.log(url)
        const response = await fetch(url)
        const json = await response.json();
        //console.log(json)

        let p = {
        name: json.product.product_name,
        brand: json.product.brands,
        imgUrl: json.product.image_url,
        ingredients: json.product.ingredients.map((i) => 
        ({
            name: i.id.split(":")[1],
            //isIrritant: (this.irrList.indexOf(i.text.toLowerCase()) > -1 )
            fodmapStatus: this.ingList.find(o => o.name == i.id.split(":")[1])?.score
        })),
        //hasIrritants : false
        }

        p.ingredients.forEach(i => {
            if(!i.fodmapStatus)
            {
                i.fodmapStatus = "unknown"
            }
        });

        if (p.ingredients.some((i) => i.fodmapStatus === 'high')){
            p.fodmapStatus = "high"
        }
        else if (p.ingredients.some((i) => i.fodmapStatus === 'medium')){
            p.fodmapStatus = "medium"
        }
        else if (p.ingredients.some((i) => i.fodmapStatus === 'low')){
            p.fodmapStatus = "low"
        }
        else {
            p.fodmapStatus = "unknown"
        }

        //remove dups
        p.ingredients = [...new Set(p.ingredients)];///////DOESNT WORK

        console.log(p)


        return p
    }
}