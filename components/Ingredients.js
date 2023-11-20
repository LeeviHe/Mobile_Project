import { Text, View, Image, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Container, Row, Col} from "react-native-flex-grid";

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

export default function Ingredients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientData, setIngredientData] = useState([])
  const [errorStatus, setErrorStatus] = useState('')

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    if (searchQuery.trim().length === 0 ) {
      defaultSetup()
    } else {
      handleSearch()
    }
  }, [searchQuery])
    
    async function getIngredient(method) {

      try {
        const response = await fetch(URL + method);
        if (response.ok) {
          const json = await response.json();
          if (json.ingredients === undefined || json.ingredients === null || json.ingredients === '' || json.ingredients === 0 || !json.ingredients) {
            setErrorStatus('No ingredients found!')
            setIngredientData([])
            return
          } else {
            setErrorStatus('')
          }
          const ingredients = json.ingredients;
          setIngredientData(ingredients);
        } else {
            alert('Error retrieving ingredients!')
          }
      } catch (err) {
          alert(err);
        }
    }
    
  
const handleSearch = () => {
  getIngredient('search.php?i=' + searchQuery)
}

const defaultSetup = () => {
  getIngredient('search.php?i=')
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
    <View style={{backgroundColor:'lightgray'}}>
      <Text style={{paddingTop: 100, paddingLeft: 120, fontSize: 28}}>Ingredients</Text>
      <Row>
        <Col>
          <Searchbar
            placeholder="Search"
            onChangeText={(value) => {onChangeSearch(value)}}
            value={searchQuery}/>
        </Col>
        <Col>
          <Pressable>
            <Text>Filters</Text>
          </Pressable>
        </Col>
    </Row>
    <ScrollView>
        {errorStatus.trim().length === 0 ? 
        <View>
          {ingredient}
        </View>
        : 
        <View>
          <Text>{errorStatus}</Text>
        </View>}
      </ScrollView>
    </View>
  );
}