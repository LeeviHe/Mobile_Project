import { Text, View, Image, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Container, Row, Col} from "react-native-flex-grid";

const URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

export default function Cocktails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeData, setRecipeData] = useState([])
  const [errorStatus, setErrorStatus] = useState('')

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    if (searchQuery.trim().length === 0 ) {
      defaultSetup()
    } else {
      handleSearch()
    }
  }, [searchQuery])
  
  
  async function getDrink(method) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        const json = await response.json();
        if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks) {
          setErrorStatus('No drinks found!')
          setRecipeData([])
          return
        } else {
          setErrorStatus('')
        }
        const drinks = json.drinks;
        setRecipeData(drinks);
      } else {
          alert('Error retrieving recipes!');
        }
    } catch (err) {
        alert(err);
      }
  }

  const handleSearch = () => {
    getDrink('search.php?s=' + searchQuery);
  }

  const defaultSetup = () => {
    getDrink('search.php?s=')
  }

    const drink = recipeData.map((data, id) => {
      return (
          <View key={id}>
            <Image 
            source={{uri:data.strDrinkThumb}}
            style={{width: 100, height: 100}}/>
            <Text>{data.strDrink}</Text>
            <Text>Category: {data.strCategory}</Text>
          </View>
      )
    })


  return (
    <View style={{backgroundColor:'lightgray'}}>
      <Text style={{paddingTop: 100, paddingLeft: 120, fontSize: 28}}>Cocktails</Text>
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
          {drink}
        </View>
        : 
        <View>
          <Text>{errorStatus}</Text>
        </View>}
      </ScrollView>
    </View>
  );
}