import { Text, View, Image, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Container, Row, Col} from "react-native-flex-grid";

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

export default function Cocktails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeData, setRecipeData] = useState([])
  const [sortedDrinks, setSortedDrinks] = useState([])
  const [categoryJson, setCategoryJson] = useState([])
  const [ingredientJson, setIngredientJson] = useState([])
  const [errorStatus, setErrorStatus] = useState('')
  const [filterView, setFilterView] = useState(false)
  const [ascendSort, setAscendSort] = useState(false)
  const [descendSort, setDescendSort] = useState(false)
  
  useEffect(() => {
    if (categoryJson.length === 0){
      getJson("list.php?c=list" , setCategoryJson)
    }
    if (ingredientJson.length === 0) {
      getJson("list.php?i=list", setIngredientJson)
    }
  }, [categoryJson, ingredientJson])

  useEffect(() => {
    if (searchQuery.trim().length === 0 && !ascendSort && !descendSort) {
      defaultSetup()
    } else {
      handleSearch()
    }
  }, [searchQuery])

  useEffect(() => {
    if (ascendSort) {
      setSortedDrinks(recipeData.sort((a, b) => a.strDrink.localeCompare(b.strDrink)))
      console.log('Ascend on')
    } else if (descendSort) {
      setSortedDrinks(recipeData.sort((a, b) => b.strDrink.localeCompare(a.strDrink)))
      console.log('Descend on')
    } else {
      console.log('reset')
      setSortedDrinks(recipeData)
    }
  }, [ascendSort, descendSort, recipeData])

  async function getJson(method, param) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        const json = await response.json()
        const data = json.drinks
        param(data)
      } else {
          alert('Error retrieving recipes!');
        }
    } catch (err) {
        alert(err);
      }
  }

  const onChangeSearch = query => setSearchQuery(query);

  async function getDrink(method) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        const json = await response.json();
        if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks || json.drinks === "None Found") {
          setErrorStatus('No drinks found!')
          console.log('nodrinks')
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

  const drink = sortedDrinks.map((data, id) => {
    return (
        <View key={id}>
          <Image 
          source={{uri:data.strDrinkThumb}}
          style={{width: 100, height: 100}}/>
          <Text>{data.strDrink}</Text>
          {!data.strCategory ? 
            <Text></Text>
            :
            <Text>Category: {data.strCategory}</Text>}
        </View>
    )
  })

  const categories = categoryJson.map((data, id) => {
    return (
        <View key={id}>
          <Row>
            <Col>
              <Text>{data.strCategory}</Text>
            </Col>
            <Col>
              <Pressable
                key={"ctgr:" + data.strCategory}
                onPress={() => searchFilter('c', data.strCategory)}>
                <Text style={backgroundColor='red'}>x</Text>
              </Pressable>
            </Col>
          </Row>
        </View>
    )
  })

  const ingredients = ingredientJson.map((data, id) => {
    return (
        <View key={id}>
          <Row>
            <Col>
              <Text>{data.strIngredient1}</Text>
            </Col>
            <Col>
              <Pressable
                key={"ingrdt:" + data.strIngredient1}
                onPress={() => searchFilter('i', data.strIngredient1)}>
                <Text style={backgroundColor='red'}>x</Text>
              </Pressable>
            </Col>
          </Row>
        </View>
    )
  })

  async function viewFilter() {
    if (!filterView) {
      setFilterView(true)
    } else if (filterView) {
      setFilterView(false)
    }
  }

  function searchFilter (parame1, parame2) {
    console.log(parame2)
    getDrink('filter.php?' + parame1 + '=' + parame2)

  }

  function ascending () {
    setAscendSort(!ascendSort)
    console.log('toggle ascend')
    setDescendSort(false)
    handleSearch()
  }

  function descending () {
    setDescendSort(!descendSort)
    console.log('toggle descend')
    setAscendSort(false)
    handleSearch()
  }

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
          <Pressable
            key={'filterbtn'}
            onPress={() => viewFilter()}>
            <Text>Filters</Text>
          </Pressable>
        </Col>
      </Row>
      {filterView ?    
      <ScrollView>
        <Text>Categories: </Text>
        <View>
          {categories}
        </View>
        
        <View>
          <Text>Sort</Text>
          <Pressable
          onPress={() => ascending()}>
            <Text>A-Z</Text>
          </Pressable>
          <Pressable
          onPress={() => descending()}>
            <Text>Z-A</Text>
          </Pressable>
        </View>
        <View>
          <Text>Base ingredients</Text>
          <ScrollView style={{height:200}}>
            {ingredients}
          </ScrollView>
        </View>
      </ScrollView>
      :
      <ScrollView>
        {errorStatus.trim().length === 0 ? 
        <View>
          {drink}
        </View>
        : 
        <View>
          <Text>{errorStatus}</Text>
        </View>}
      </ScrollView>}
    </View>
  );
}