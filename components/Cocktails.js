import { Text, View, Image, Pressable, Button, TouchableOpacity } from 'react-native';
import { Searchbar, RadioButton } from 'react-native-paper';
import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Container, Row, Col } from "react-native-flex-grid";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import styles from '../styles/styles';
import { DEVS_FAVOURITES } from '../reusables/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from "react-native-bouncy-checkbox";

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
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);


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
    let sort = [...selectedSort];
    sort.fill(false);
    sort[i] = true;
    setSelectedSort(sort);
    setAscendSort(true);
    setDescendSort(false);
  }

  function descending(i) {
    let sort = [...selectedSort];
    sort.fill(false);
    sort[i] = true;
    setSelectedSort(sort);
    setDescendSort(true);
    setAscendSort(false);
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
    return selectedSort[i] ? colors.mainFontColour : colors.white
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
    getDrink('search.php?s=coffee')
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
        <TouchableOpacity key={id} style={[styles.cocktail, { backgroundColor: categoryBackgroundColor() }]}
          onPress={() => navigation.navigate('Recipe', {
            drinkId: data.idDrink,
            drinkName: data.strDrink,
            image: data.strDrinkThumb,
            category: data.strCategory,
            glass: data.strGlass,
            instructions: data.strInstructions
          })}>
          <Image
            source={{ uri: data.strDrinkThumb }}
            style={styles.drinkImg}
          />
          <View style={styles.cocktailInfo}>
            <Text style={styles.drinkText}>{data.strDrink}</Text>
            {data.strCategory && (
              <Text style={styles.drinkText}>{data.strCategory}</Text>
            )}

          </View>
        </TouchableOpacity>
      </View>
    )
  })

  const toggleCategoryDropdown = () => {
    setShowDropdown1(!showDropdown1);
  };

  const toggleIngredientDropdown = () => {
    setShowDropdown2(!showDropdown2);
  };

  const selectCategory = (id) => {
    searchFilter(id, 'c', categoryJson[id].strCategory, false);
  };

  const categoryDropdownContent = (
    <View>
      {showDropdown1 && (
        <View style={styles.dropdownList}>
          {categoryJson.map((data, id) => (
            <TouchableOpacity
              key={id}
              onPress={() => selectCategory(id)}>

              <View style={styles.dropdownContainer}>
                <View>
                  <Text style={{ fontFamily: fonts.text }}>{data.strCategory}</Text>
                </View>

                <View>
                  <RadioButton.Android
                    style={{ alignSelf: 'flex-end' }}
                    status={selectedCategory[id] ? 'checked' : 'unchecked'}
                    color={colors.mainFontColour}
                    onPress={() => selectCategory(id)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const ingredientDropdownContent = (
    <View>
      {showDropdown2 && (
        <View style={styles.dropdownList}>
          {ingredientJson.map((data, id) => (
            <TouchableOpacity key={id} onPress={() => selectFilter(id, data.strIngredient1)}>

              <View style={styles.dropdownContainer}>
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>{data.strIngredient1}</Text>
                </View>

                <BouncyCheckbox
                  size={22}
                  disableText={true}
                  fillColor={multiFilterSelectColor()}
                  unfillColor={multiFilterSelectColor()}
                  iconComponent={<Icon name={'check'} size={20} color='gray' />} // toggle this
                  onPress={() => selectFilter(id, data.strIngredient1)}
                  style={{ borderWidth: 1, borderRadius: '50%', marginLeft: 10, borderColor: colors.mainFontColour }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

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
            <View style={{ marginHorizontal: 20 }}>

              <View style={styles.filterHeader}>
                <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>cancel</Text>
                <Text style={styles.filterHeading}>Filters</Text>
                <TouchableOpacity>
                  <Icon name={'restore'} size={25} color={colors.mainFontColour} />
                </TouchableOpacity>
              </View>

              <View marginTop={40}>
                <Text style={styles.filterHeading}>Sort</Text>

                <View style={styles.filterContainer}>
                  <View style={styles.filterSort}>
                    <Text style={{ fontFamily: fonts.text }}>Name A-Z</Text>

                    <BouncyCheckbox
                      size={22}
                      disableText={true}
                      fillColor='transparent'
                      unfillColor='transparent'
                      iconComponent={<Icon name={'check'} size={20} color={sortColor(0)} />}
                      onPress={() => ascending(0)}
                      style={{ borderWidth: 1, borderRadius: '50%', borderColor: colors.mainFontColour }}
                    />

                  </View>

                  <View style={styles.filterSort}>
                    <Text style={{ fontFamily: fonts.text }}>Name Z-A</Text>

                    <BouncyCheckbox
                      size={22}
                      disableText={true}
                      fillColor='transparent'
                      unfillColor='transparent'
                      iconComponent={<Icon name={'check'} size={20} color={sortColor(1)} />}
                      onPress={() => descending(1)}
                      style={{ borderWidth: 1, borderRadius: '50%', borderColor: colors.mainFontColour }}
                    />

                  </View>
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                <View style={[styles.dropdownContainer, { marginBottom: 10 }]}>
                  <Text style={styles.filterHeading}>Categories</Text>

                  <TouchableOpacity onPress={toggleCategoryDropdown} style={styles.dropdownHeader}>
                    <Icon name={showDropdown1 ? 'minus' : 'plus'} size={40} color={colors.mainFontColour} />
                  </TouchableOpacity>
                </View>

                <View>
                  {categoryDropdownContent}
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                <View style={[styles.dropdownContainer, { marginBottom: 10 }]}>
                  <Text style={styles.filterHeading}>Base Ingredients</Text>

                  <TouchableOpacity onPress={toggleIngredientDropdown} style={styles.dropdownHeader}>
                    <Icon name={showDropdown2 ? 'minus' : 'plus'} size={40} color={colors.mainFontColour} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: showDropdown2 ? 300 : 0 }}>
                  {ingredientDropdownContent}
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