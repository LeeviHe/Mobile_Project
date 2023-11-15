import { Text, View, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';

const URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

export default function Cocktails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeData, setRecipeData] = useState([])

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
      handleSearch()
  }, [searchQuery])
    
  const handleSearch = () => {
    async function getDrink() {
      if (searchQuery === '' || searchQuery === ' ') {
        setRecipeData([])
        return
      }
      try {
        const response = await fetch(URL + searchQuery);
        if (response.ok) {
          const json = await response.json();
          if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks) {
            console.log("Can't find drinks")
            setRecipeData([])
            return
          }

          const drinks = json.drinks;
          setRecipeData(drinks);
              
        } else {

            alert('Error retrieving recipes!' + {searchQuery});
          }
      } catch (err) {
          alert(err);
        }
    }
    getDrink();
  }

    const recipe = recipeData.map((data, id) => {
      return (
          <View key={id}>
            <Image 
            source={{uri:data.strDrinkThumb}}
            style={{width: 100, height: 100}}/>
            <Text>{data.strDrink}</Text>
            <Text>Type of glass:{data.strGlass}</Text>
            <Text>Category: {data.strCategory}</Text>
          </View>
      )
  
    })


  return (
    <View>
      <Text style={{paddingTop: 100, paddingLeft: 120, fontSize: 28}}>Cocktails</Text>
      <Searchbar
      placeholder="Search"
      onChangeText={(value) => {onChangeSearch(value)}}
      value={searchQuery}/>
      <ScrollView>
        <View>
          {recipe}
        </View>
      </ScrollView>
    </View>
  );
}