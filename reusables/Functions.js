export async function getJsonDrinks (url, condition, setJsonData) {
        try {
        const response = await fetch(url + condition);
        if (response.ok) {
            const json = await response.json()
            const data = json.drinks
            setJsonData(data)
        } else {
            alert('Error retrieving recipes!');
        }
        } catch (err) {
        alert(err);
        }
    }
export async function getJsonIngredients (url, condition, setJsonData) {
        try {
        const response = await fetch(url + condition);
        if (response.ok) {
            const json = await response.json()
            const data = json.ingredients
            setJsonData(data)
        } else {
            alert('Error retrieving recipes!');
        }
        } catch (err) {
        alert(err);
        }
    }