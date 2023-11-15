import { Text, View, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';

const URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i=';

export default function Ingredients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientData, setIngredientData] = useState([])

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
      handleSearch()
  }, [searchQuery])
    
  const handleSearch = () => {
    async function getIngredient() {
      if (searchQuery === '' || searchQuery === ' ') {
        setIngredientData([])
        return
      }
      try {
        const response = await fetch(URL + searchQuery);
        if (response.ok) {
          const json = await response.json();
          if (json.ingredients === undefined || json.ingredients === null || json.ingredients === '' || json.ingredients === 0 || !json.ingredients) {
            console.log("Can't find ingredient")
            setIngredientData([])
            return
          }

          const ingredients = json.ingredients;
          setIngredientData(ingredients);
              
        } else {

            alert('Error retrieving ingredients!' + {searchQuery}); //poista check
          }
      } catch (err) {
          alert(err);
        }
    }
    getIngredient();
  }

    const ingredient = ingredientData.map((data, id) => {
      return (
          <View key={id}>
            <Image 
            source={{uri:'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png'}}
            style={{width: 100, height: 100}}/>
            <Text>{data.strIngredient}</Text>
            {data.strType === null ? <Text></Text>: <Text>Type: {data.strType}</Text>}
            <Text>Alcoholic: {data.strAlcohol}</Text>
            {data.strABV === null ? <Text></Text>: <Text>%: {data.strABV}</Text>}
          </View>
      )
  
    })


  return (
    <View>
      <Text style={{paddingTop: 100, paddingLeft: 120, fontSize: 28}}>Ingredients</Text>
      <Searchbar
      placeholder="Search"
      onChangeText={(value) => {onChangeSearch(value)}}
      value={searchQuery}/>
      <ScrollView>
        <View>
          {ingredient}
        </View>
      </ScrollView>
    </View>
  );
}