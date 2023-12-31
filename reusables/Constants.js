export const DEVS_FAVOURITES = [
    {
        idDrink: "17204",
        strDrink: "Long Island Iced Tea",
        strCategory: "Ordinary Drink",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/wx7hsg1504370510.jpg",
    },
    {
        idDrink: "12754",
        strDrink: "Sex on the Beach",
        strCategory: "Ordinary Drink",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/fi67641668420787.jpg"
    },
    {
        idDrink: "13971",
        strDrink: "Irish Coffee",
        strCategory: "Coffee / Tea",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/sywsqw1439906999.jpg"
    },
    {
        idDrink: "12738",
        strDrink: "Hot Chocolate to Die for",
        strCategory: "Cocoa",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/0lrmjp1487603166.jpg"
    },
    {
        idDrink: "178306",
        strDrink: "Slippery Nipple",
        strCategory: "Shot",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/l9tgru1551439725.jpg"
    },
    {
        idDrink: "12656",
        strDrink: "Banana Strawberry Shake",
        strCategory: "Shake",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/vqquwx1472720634.jpg"
    },
    {
        idDrink: "178356",
        strDrink: "Butterfly Effect",
        strCategory: "Cocktail",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/ht3hnk1619704289.jpg"
    },
    {
        idDrink: "178325",
        strDrink: "Aperol Spritz",
        strCategory: "Cocktail",
        strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/iloasq1587661955.jpg"
    },
]

export const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
export const FAVOURITE_DRINKS_KEY = "@favourites"
export const OWNED_INGR_KEY = "@owned"
export const MAPS_KEY = "AIzaSyAxr6uGD0CCuomLoT8JM3VtZM9uBFV6CvU"

export const isAlcoholic = (category) => {
    const alcoholicCategories = [
    'Ordinary Drink',
    'Cocktail',
    'Shot',
    'Homemade Liqueur',
    'Punch / Party Drink',
    'Beer'
]

return alcoholicCategories.includes(category)
}

export const isNotAlcoholic = (category) => {
const nonAlcoholicCategories = [
    'Shake',
    'Cocoa'
]
return nonAlcoholicCategories.includes(category)
}
