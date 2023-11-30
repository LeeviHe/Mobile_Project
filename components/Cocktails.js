import { Text, View, Image, Pressable, Button } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Container, Row, Col } from "react-native-flex-grid";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, padding, textStyles } from '../styles/style-constants';
import styles from '../styles/styles';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const Stack = createNativeStackNavigator()
export default function Cocktails({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  //Non-sorted drink data
  const [recipeData, setRecipeData] = useState([])
  //Sorted and final drink data for showing
  const [activeDrinks, setActiveDrinks] = useState([])
  //JSON for categories on filter page
  const [categoryJson, setCategoryJson] = useState([])
  //JSON for ingredients on filter page
  const [ingredientJson, setIngredientJson] = useState([])
  //Selected category filter (11)
  const [selectedCategory, setSelectedCategory] =
    useState(new Array(11).fill(false))
  //Selected alcoholic filter (2) //fix alcoholselect / selectalcohol mixup
  const [selectedAlcohol, setSelectedAlcohol] =
    useState(new Array(2).fill(false))
  //Selected multi-ingredient filters (489)
  const [selectedIngredients, setSelectedIngredients] =
    useState(new Array(489).fill(false))
  //Activated multi-ingredient filters that are supposed to show
  const [activeFilters, setActiveFilters] = useState([])

  const [errorStatus, setErrorStatus] = useState('')
  const [filterView, setFilterView] = useState(false)
  const [ascendSort, setAscendSort] = useState(false)
  const [descendSort, setDescendSort] = useState(false)


  //
  //useEffects
  useEffect(() => {
    console.log(activeFilters)
    let string = activeFilters.toString()
    if (activeFilters.length === 0) {
      console.log('empty')
    } else {
      searchFilter('', 'i', string)
    }
  }, [activeFilters])

  useEffect(() => {
    if (categoryJson.length === 0) {
      getJson("list.php?c=list", setCategoryJson)
    }
    if (ingredientJson.length === 0) {
      getJson("list.php?i=list", setIngredientJson)
    }
  }, [categoryJson, ingredientJson])

  useEffect(() => {
    if (searchQuery.trim().length === 0 && !ascendSort && !descendSort && activeFilters.length === 0) {
      defaultSetup()
    } else if (activeFilters.length > 0 && searchQuery.trim().length === 0) {
      let string = activeFilters.toString()
      searchFilter('i', string)
    } else {
      handleSearch()
    }
  }, [searchQuery])

  useEffect(() => {
    if (ascendSort) {
      setActiveDrinks(recipeData.sort((a, b) => a.strDrink.localeCompare(b.strDrink)))
      console.log('Ascend on')
    } else if (descendSort) {
      setActiveDrinks(recipeData.sort((a, b) => b.strDrink.localeCompare(a.strDrink)))
      console.log('Descend on')
    } else {
      console.log('reset')
      setActiveDrinks(recipeData)
    }
  }, [ascendSort, descendSort, recipeData])

  //
  //functions
  async function getJson(condition, setJsonData) {
    try {
      const response = await fetch(URL + condition);
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

  async function viewFilter() {
    if (!filterView) {
      setFilterView(true)
    } else if (filterView) {
      setFilterView(false)
    }
    console.log('pressed')
  }

  async function getDrink(method) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        const json = await response.json();
        if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks || json.drinks === "None Found") {
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

  // Condition for what you want to filter with
  function searchFilter(id, condition, search) {
    /*
    console.log(id + ' idd')
    console.log(condition + ' condditii') 
    console.log(search + ' searct')
    */
    if (condition == 'c') {
      let filters = [...selectedCategory]
      filters.fill(false)
      filters[id] = selectedCategory[id] ? false : true
      setSelectedCategory(filters)
      selectedAlcohol.fill(false)
      selectedIngredients.fill(false)
      setActiveFilters([])
    } else if (condition == 'a') {
      let filters = [...selectedAlcohol]
      filters.fill(false)
      filters[id] = selectedAlcohol[id] ? false : true
      setSelectedAlcohol(filters)
      selectedCategory.fill(false)
      selectedIngredients.fill(false)
      setActiveFilters([])
    }
    getDrink('filter.php?' + condition + '=' + search)
  }

  function ascending() {
    setAscendSort(!ascendSort)
    console.log('toggle ascend')
    setDescendSort(false)
    handleSearch()
  }

  function descending() {
    setDescendSort(!descendSort)
    console.log('toggle descend')
    setAscendSort(false)
    handleSearch()
  }

  function multiFilterSelect(i) {
    return selectedIngredients[i] ? 'green' : 'red'
  }
  //fix alcoholselect / selectalcohol mixup
  function alcoholSelect(i) {
    return selectedAlcohol[i] ? 'green' : 'red'
  }

  function categorySelect(i) {
    return selectedCategory[i] ? 'green' : 'red'
  }

  //
  //consts
  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch = () => {
    getDrink('search.php?s=' + searchQuery);
  }

  const defaultSetup = () => {
    getDrink('search.php?s=Coffee') //White russian only for performance, 'search.php?s=' for actual app
  }

  const selectFilter = (i, ingredient) => {
    //Empty other filters
    let alcoholic = [...selectedAlcohol]
    let category = [...selectedCategory]
    alcoholic.fill(false)
    category.fill(false)
    setSelectedAlcohol(alcoholic)
    setSelectedCategory(category)
    //Original
    let filters = [...selectedIngredients]
    filters[i] = selectedIngredients[i] ? false : true
    setSelectedIngredients(filters)
    if (selectedIngredients[i]) {
      (console.log('splice'))//delete
      setActiveFilters(oldValues => {
        return oldValues.filter(filter => filter !== ingredient)
      })
    } else {
      console.log('push')//delete
      let filterCopy = [...activeFilters]
      filterCopy.push(ingredient)
      setActiveFilters(filterCopy)
    }
  }


  const drink = activeDrinks.map((data, id) => {
    return (
      <View key={id}>
        <Image
          source={{ uri: data.strDrinkThumb }}
          style={{ width: 100, height: 100 }} />
        <Text>{data.strDrink}</Text>
        {!data.strCategory ?
          <Text></Text>
          :
          <Text>Category: {data.strCategory}</Text>}
        <Button
          title='To recipe'
          onPress={() =>
            navigation.navigate('Recipe'
              , /*{
                drinkId: data.idDrink,
                drinkName: data.strDrink,
                image: data.strDrinkThumb,
                category: data.strCategory,
                glass: data.strGlass,
              instructions: data.strInstructions
             }*/)}
        />
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
              onPress={() => searchFilter(id, 'c', data.strCategory)}>
              <Text style={{ color: categorySelect(id) }}>x</Text>
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
              onPress={() => selectFilter(id, data.strIngredient1)}>
              <Text style={{ color: multiFilterSelect(id) }}>x</Text>
            </Pressable>
          </Col>
        </Row>
      </View>
    )
  })

  return (
    <View style={{ backgroundColor: colors.white }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>Cocktails</Text>

      <View style={{ marginBottom: 50 }}>
        <Row style={styles.searchFilterRow}>
          <Col style={[styles.searchFilterCol, padding.none]}>
            <Searchbar
              placeholder="Search"
              onChangeText={(value) => { onChangeSearch(value) }}
              value={searchQuery}
              style={styles.search}
              inputStyle={{ marginTop: -10 }}
              iconColor={colors.mainFontColour}
              placeholderTextColor={colors.mainFontColour} />
          </Col>

          <Col style={padding.none}>
            <Pressable
              key={'filterbtn'}
              style={({ pressed }) => [
                styles.filterBtn,
                { opacity: pressed ? 0.5 : 1.0 }
              ]}
              onPress={() => viewFilter()}>
              <Text style={textStyles.button}>Filters</Text>
            </Pressable>
          </Col>
        </Row>
      </View>

      {
        filterView ?
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
              <ScrollView style={{ height: 200 }}>
                {ingredients}
              </ScrollView>
            </View>
            <View>
              <Pressable
                onPress={() => searchFilter(0, 'a', 'Alcoholic')}>
                <Text style={{ color: alcoholSelect(0) }}>Alcoholic</Text>
              </Pressable>
              <Pressable
                onPress={() => searchFilter(1, 'a', 'Non_Alcoholic')}>
                <Text style={{ color: alcoholSelect(1) }}>Non-Alcoholic</Text>
              </Pressable>
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
          </ScrollView>
      }
    </View >
  );
}