import { Text, View, Image, Pressable, Button } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Container, Row, Col } from "react-native-flex-grid";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, padding, textStyles } from '../styles/style-constants';
import styles from '../styles/styles';
import { DEVS_FAVOURITES } from '../reusables/Constants';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const Stack = createNativeStackNavigator()
export default function Cocktails({ navigation, route }) {
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
  //Selected Sorting
  const [selectedSort, setSelectedSort] =
    useState(new Array(2).fill(false))
  //Selected multi-ingredient filters (489)
  const [selectedIngredients, setSelectedIngredients] =
    useState(new Array(489).fill(false))
  //Activated multi-ingredient filters that are supposed to show
  const [activeFilters, setActiveFilters] = useState([])
  // Checking if any categories/alc/non-alc are selected
  const [activeCategory, setActiveCategory] = useState(false)
  // Variable to replace strCategory in filtering situation
  const [replaceCategory, setReplaceCategory] = useState('')

  const [errorStatus, setErrorStatus] = useState('')
  const [filterView, setFilterView] = useState(false)
  const [ascendSort, setAscendSort] = useState(false)
  const [descendSort, setDescendSort] = useState(false)


  //
  //useEffects
  useEffect(() => {
    let string = activeFilters.toString()
    if (activeFilters.length === 0) {
      console.log('empty')
    } else if (activeFilters.length !== 0) {
      searchFilter('', 'i', string, false)
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
    console.log(activeFilters)
    if (route.params !== undefined && route.params.id !== 'empty' && searchQuery.trim().length === 0) {
      console.log('Cocktails Screen Params:', route.params)
      if (route.params.condition) {
        if (route.params.condition == 'popular' || route.params.condition == 'latest') {
          getDrink(route.params.search)
        } else if (route.params.condition == 'devs') {
          setRecipeData(DEVS_FAVOURITES)
        } else {
          searchFilter(route.params.id, route.params.condition, route.params.search, true)
        }
      }
      // Random Drink to recipe screen
      //else if (route.params.search == 'random.php') {
      //getDrink
      //}
    } else if (searchQuery.trim().length === 0 && !ascendSort && !descendSort && activeFilters.length === 0 && activeCategory == false) {
      defaultSetup()
    } else if (activeFilters.length > 0 && activeFilters !== true && activeFilters !== false && searchQuery.trim().length === 0) {
      console.log(activeFilters)
      let string = activeFilters.toString()
      searchFilter('', 'i', string)
    } else if (searchQuery.length > 0) {
      handleSearch()
    }
  }, [searchQuery, route.params])

  useEffect(() => {
    if (ascendSort) {
      setActiveDrinks(recipeData.sort((a, b) => a.strDrink.localeCompare(b.strDrink)))
      console.log('Ascend on')
    } else if (descendSort) {
      setActiveDrinks(recipeData.sort((a, b) => b.strDrink.localeCompare(a.strDrink)))
      console.log('Descend on')
    } else if (recipeData.length > 0) {
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
  }

  async function getDrink(method, category) {
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
        console.log(method)
        const drinks = json.drinks;
        setRecipeData(drinks);
        setReplaceCategory(category)
      } else {
        alert('Error retrieving recipes!');
      }
    } catch (err) {
      alert(err);
    }
  }

  // Condition for what you want to filter with
  function searchFilter(id, condition, search, discovery) {
    if (condition == 'c') {
      let filters = [...selectedCategory]
      filters.fill(false)
      if (discovery === true) {
        filters[id] = true
      } else {
        filters[id] = selectedCategory[id] ? false : true
        navigation.setParams({ id: 'empty' })
      }
      setSelectedCategory(filters)
      selectedAlcohol.fill(false)
      selectedIngredients.fill(false)
      setActiveFilters([])
      setActiveCategory(filters[id])
    } else if (condition == 'a') {
      let filters = [...selectedAlcohol]
      filters.fill(false)
      if (discovery === true) {
        filters[id] = true
      } else {
        filters[id] = selectedAlcohol[id] ? false : true
        navigation.setParams({ id: 'empty' })
      }
      setSelectedAlcohol(filters)
      selectedCategory.fill(false)
      selectedIngredients.fill(false)
      setActiveFilters([])
      setActiveCategory(filters[id])
    }
    getDrink('filter.php?' + condition + '=' + search, search)
  }

  function ascending(i) {
    let sort = [...selectedSort]
    sort.fill(false)
    sort[i] = selectedSort[i] ? false : true
    setSelectedSort(sort)
    console.log(ascendSort)
    setAscendSort(!ascendSort)
    console.log('toggle ascend')
    console.log(ascendSort)
    setDescendSort(false)
    // Unknown
    /*if (!route.params && !activeFilters) {
      handleSearch()
    }*/
  }

  function descending(i) {
    let sort = [...selectedSort]
    sort.fill(false)
    sort[i] = selectedSort[i] ? false : true
    setSelectedSort(sort)
    console.log(descendSort)
    setDescendSort(!descendSort)
    console.log('toggle descend')
    console.log(descendSort)
    setAscendSort(false)
    //Unknown
    /*if (!route.params && !activeFilters) {
      handleSearch()
    }*/
  }

  function multiFilterSelectColor(i) {
    return selectedIngredients[i] ? 'green' : 'red'
  }
  //fix alcoholselect / selectalcohol mixup
  function alcSelectColor(i) {
    return selectedAlcohol[i] ? 'green' : 'red'
  }

  function categorySelectColor(i) {
    return selectedCategory[i] ? 'green' : 'red'
  }

  function sortColor(i) {
    return selectedSort[i] ? 'green' : 'red'
  }

  //
  //consts
  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch = () => {
    selectedCategory.fill(false)
    selectedIngredients.fill(false)
    selectedAlcohol.fill(false)
    setActiveFilters([])
    getDrink('search.php?s=' + searchQuery);
  }

  const defaultSetup = () => {
    getDrink('search.php?s=zokse') //White russian only for performance, 'search.php ? s = ' for actual app
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

  const isAlcoholic = (category) => {
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

  const isNotAlcoholic = (category) => {
    const nonAlcoholicCategories = [
      'Shake',
      'Cocoa'
    ]

    return nonAlcoholicCategories.includes(category)
  }

  const drink = activeDrinks.map((data, id) => {
    // Duplicates for search query issues
    const categoryColors = {
      'Coffee_/_Tea': colors.brown,
      'Coffee / Tea': colors.brown,
      'Other / Unknown': '#999',
      'Alcoholic': colors.purple,
      'Non_Alcoholic': colors.green,
      'Non Alcoholic': colors.green,
      'Soft Drink': colors.yellow
    }

    function categoryBackgroundColor() {
      if (data.strCategory) {

      return isAlcoholic(data.strCategory)
      ? categoryColors['Alcoholic']
      : isNotAlcoholic(data.strCategory)
        ? categoryColors['Non_Alcoholic']
        : categoryColors[data.strCategory] || 'pink';
      } else {
        return isAlcoholic(replaceCategory)
        ? categoryColors['Alcoholic']
        : isNotAlcoholic(replaceCategory)
          ? categoryColors['Non_Alcoholic']
          : categoryColors[replaceCategory] || 'pink';
      }
    }
    
    return (
      <View style={styles.drinkContainer}>
        <View key={id} style={[styles.cocktail, { backgroundColor: categoryBackgroundColor()}]}>
          <Image
            source={{ uri: data.strDrinkThumb }}
            style={styles.drinkImg} />

          <View style={styles.cocktailInfo}>
            <Text style={styles.drinkText}>{data.strDrink}</Text>
            {data.strCategory && (
              <Text style={styles.drinkText}>{data.strCategory}</Text>
            )}

          </View>
          {/**
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
             })}
        /> */}
        </View>
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
              onPress={() => searchFilter(id, 'c', data.strCategory, false)}>
              <Text style={{ color: categorySelectColor(id) }}>x</Text>
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
              <Text style={{ color: multiFilterSelectColor(id) }}>x</Text>
            </Pressable>
          </Col>
        </Row>
      </View>
    )
  })

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
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
                onPress={() => ascending(0)}>
                <Text style={{ color: sortColor(0) }}>A-Z</Text>
              </Pressable>
              <Pressable
                onPress={() => descending(1)}>
                <Text style={{ color: sortColor(1) }}>Z-A</Text>
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
                <Text style={{ color: alcSelectColor(0) }}>Alcoholic</Text>
              </Pressable>
              <Pressable
                onPress={() => searchFilter(1, 'a', 'Non_Alcoholic')}>
                <Text style={{ color: alcSelectColor(1) }}>Non-Alcoholic</Text>
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