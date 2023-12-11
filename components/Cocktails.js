
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Searchbar, RadioButton } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-virtualized-view'
import { Row, Col } from "react-native-flex-grid";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import styles from '../styles/styles';
import { DEVS_FAVOURITES, FAVOURITE_DRINKS_KEY, URL } from '../reusables/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getJsonDrinks } from '../reusables/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  // To replace strCategory in filtering situation
  const [replaceCategory, setReplaceCategory] = useState('')
  // To set current filter condition for activating filter
  const [filterCondition, setFilterCondition] = useState('')
  // To set current filter search for activating filter
  const [filterSearch, setFilterSearch] = useState('')
  // To set first of multi-filter ingredients
  const [firstMultiFilter, setFirstMultiFilter] = useState('') 
  // Iteration of favourited drinks
  const [favourites, setFavourites] = useState([])

  const [errorStatus, setErrorStatus] = useState('')
  const [filterView, setFilterView] = useState(false)
  const [ascendSort, setAscendSort] = useState(false)
  const [descendSort, setDescendSort] = useState(false)
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [isAPIbusy, setAPIBusy] = useState(false)

  const [visibleItems, setVisibleItems] = useState(10);

  //
  //useEffects
  useEffect (() => {
      const unsubsribe = navigation.addListener('focus', () => {
          getFavouriteData()
      })
      return unsubsribe
  }, [navigation])

  useEffect(() => {
    let string = activeFilters.toString()
    let first = activeFilters.length > 0 ? activeFilters[0].toString() : '';
    if (activeFilters.length === 0) {
      console.log('empty')
      if (route.params !== undefined && route.params.id == 'empty' && !activeCategory && searchQuery.trim().length === 0) {
        setFilterCondition('')
        setFilterSearch('')
      }
    } else if (activeFilters.length !== 0) {
      searchFilter('', 'i', string, false)
      setFirstMultiFilter(first)
    }
  }, [activeFilters])

  useEffect(() => {
    if (categoryJson.length === 0) {
      getJsonDrinks(URL, "list.php?c=list", setCategoryJson)
    }
    if (ingredientJson.length === 0) {
      getJsonDrinks(URL, "list.php?i=list", setIngredientJson)
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
          activate(route.params.condition, route.params.search)
        }
      }
    } else if (searchQuery.trim().length === 0 && activeFilters.length === 0 && !activeCategory && route.params.id !== 'empty') {
      defaultSetup()
    } else if (activeFilters.length > 0 && searchQuery.trim().length === 0) {
      let first = activeFilters.length > 0 ? activeFilters[0].toString() : '';
      let string = activeFilters.toString()
      searchFilter('', 'i', string, false, first)
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

  async function viewFilter() {
    if (!filterView) {
      setFilterView(true)
    } else if (filterView) {
      setFilterView(false)
    }
  }

  async function getDrink(method, category) {
    setAPIBusy(true)
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        console.log(method)
        const json = await response.json();
        if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks || json.drinks === "None Found") {
          setErrorStatus('No drinks found!')
          setRecipeData([])
          setAPIBusy(false)
          return
        } else {
          setErrorStatus('')
        }
        const drinks = json.drinks;
        setRecipeData(drinks);
        setReplaceCategory(category)
      } else {
        alert('Error retrieving recipes!');
      }
    } catch (err) {
      alert(err);
    }
    setAPIBusy(false)
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
      setActiveCategory(filters[id])
      setActiveFilters([])
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
      setActiveCategory(filters[id])
      setActiveFilters([])
    }
    setFilterCondition(condition)
    setFilterSearch(search)
  }


  function activate(condition, search, firstFilter) {
    if (condition === 'c' || condition === 'a') {
      getDrink('filter.php?' + condition + '=' + search, search)
    } else if (condition == 'i') {
      getDrink('filter.php?' + condition + '=' + search, firstFilter)
    } else {
      defaultSetup()
    }
    setFilterView(false)
  }

  function setSort(direction, i) {
    let sort = [...selectedSort];
    let newAscendSort = false;
    let newDescendSort = false;

    if (sort[i]) {
      sort[i] = false;
    } else {
      sort.fill(false);
      sort[i] = true;

      newAscendSort = i === 0 && direction === 'asc';
      newDescendSort = i === 1 && direction === 'desc';
    }

    setSelectedSort(sort);
    setAscendSort(newAscendSort);
    setDescendSort(newDescendSort);
  }

  function multiFilterSelectColor(i) {
    return selectedIngredients[i] ? 'green' : 'red'
  }

  //fix alcoholselect / selectalcohol mixup
  function alcSelectColor(i) {
    return selectedAlcohol[i] ? colors.mainFontColour : 'transparent';
  }

  function categorySelectColor(i) {
    return selectedCategory[i] ? 'green' : 'red'
  }

  function sortColor(i) {
    return selectedSort[i] ? colors.mainFontColour : colors.white
  }

  //
  //consts

  //Might not need
  const getFavouriteData = async () => {
      try {
          const jsonValue = await AsyncStorage.getItem(FAVOURITE_DRINKS_KEY)
          if (jsonValue !== null) {
              let tmp = JSON.parse(jsonValue)
              setFavourites(tmp)
          }
      }
      catch (e) {
          console.log('Read error: ' + e)
      }
  }

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch = () => {
    selectedCategory.fill(false)
    selectedIngredients.fill(false)
    selectedAlcohol.fill(false)
    setActiveFilters([])
    getDrink('search.php?s=' + searchQuery);
  }

  const defaultSetup = () => {
    getDrink('search.php?s=')
  }

  const selectFilter = (i, ingredient) => {
    //Empty other filters
    selectedAlcohol.fill(false)
    selectedCategory.fill(false)

    //Original
    let filters = [...selectedIngredients]
    filters[i] = selectedIngredients[i] ? false : true
    setSelectedIngredients(filters)

    if (selectedIngredients[i]) {
      console.log('splice')//delete
      setActiveFilters(oldValues => {
        return oldValues.filter(filter => filter !== ingredient)
      })
    } else {
      console.log('push')//delete
      let filterCopy = [...activeFilters]
      filterCopy.push(ingredient)
      setActiveFilters(filterCopy)
    }
    navigation.setParams({ id: 'empty' })
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

  const renderDrinkItem = ({ item, index }) => {
    const isFavourited = favourites.some((fav) => fav.drinkId === item.idDrink)

    const toggleHeart = async() => {
      try {
        if (isFavourited) {
          const newFavourites = favourites.filter((fav) => fav.drinkId !== item.idDrink)
          await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavourites))
          setFavourites(newFavourites)
          alert('Drink removed from favourites')
        } else {
          
          const newKey = favourites.length + 1
          const drinkInfo = {
            key: newKey,
            drinkId: item.idDrink,
          }
          const newFavourites = [...favourites, drinkInfo]
          await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavourites))
          setFavourites(newFavourites)
          alert('Favourite saved')
        }
      } catch(error) {
        console.log('Error saving favourite: ' + error)
        setFavourites((prevFavourites) => 
        prevFavourites.filter((fav) => fav.drinkId !== item.idDrink)
        )
      }
      //
      console.log(favourites.length)
    }

    

    const categoryBackgroundColor = () => {
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

      if (item.strCategory) {
        return isAlcoholic(item.strCategory)
          ? categoryColors['Alcoholic']
          : isNotAlcoholic(item.strCategory)
            ? categoryColors['Non Alcoholic']
            : categoryColors[item.strCategory] || colors.purple;
      } else {
        return isAlcoholic(replaceCategory)
          ? categoryColors['Alcoholic']
          : isNotAlcoholic(replaceCategory)
            ? categoryColors['Non Alcoholic']
            : categoryColors[replaceCategory] || colors.purple;
      }
    };

    return (
      <View style={styles.drinkContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.cocktail, { backgroundColor: categoryBackgroundColor() }]}
          onPress={() =>
            navigation.navigate('Recipe', {
              drinkId: item.idDrink,
              drinkName: item.strDrink,
              image: item.strDrinkThumb,
              category: item.strCategory,
              glass: item.strGlass,
              instructions: item.strInstructions,
              navigator: 'CocktailsNavigator',
              screen: 'Cocktails'
            })
          }>

          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image source={{ uri: item.strDrinkThumb }} style={styles.drinkImg} />

            <View style={styles.cocktailInfo}>
              <Text style={styles.drinkText} numberOfLines={1} ellipsizeMode="tail">
                {item.strDrink}
              </Text>
              {item.strCategory ? (
                <Text style={styles.drinkText}>{item.strCategory}</Text>
              ) : (
                <Text style={styles.drinkText}>{replaceCategory}</Text>
              )}
            </View>

          </View>

          <View style={{ marginRight: 40 }}>
            <TouchableOpacity onPress={toggleHeart}>
              <Icon name={isFavourited ? 'heart' : 'heart-outline'} size={35} color="#ff6161" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCategoryDropdown = () => {
    setShowDropdown1(!showDropdown1);
  };

  const toggleIngredientDropdown = () => {
    setShowDropdown2(!showDropdown2);
  };

  const selectCategory = (id) => {
    searchFilter(id, 'c', categoryJson[id].strCategory, false);
  };

  const resetFilters = () => {
    selectedAlcohol.fill(false)
    selectedCategory.fill(false)
    selectedIngredients.fill(false)
    selectedSort.fill(false)
    setActiveFilters([])
    setActiveCategory(false)
    setFilterCondition('')
    setFilterSearch('')
    setFirstMultiFilter('')
    defaultSetup()
  }

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

  //EVERYTHING
  const FilterItem = ({ label, onPress, checked, colors, fonts }) => (
    <View style={[styles.filterSort, { justifyContent: 'space-between' }]}>
      <Text style={{ fontFamily: fonts.text }}>{label}</Text>
      <BouncyCheckbox
        size={22}
        disableText={true}
        fillColor={colors.white}
        unfillColor={colors.white}
        iconComponent={<Icon name={'check'} size={20} color={checked ? colors.mainFontColour : 'transparent'} />}
        onPress={onPress}
        style={{ borderWidth: 1, borderRadius: 50, borderColor: colors.mainFontColour }}
      />
    </View>
  );

  const RenderIngredientDropdownContent = ({ ingredientJson, showDropdown2, selectFilter, multiFilterSelectColor, colors, fonts }) => {
    const [visibleIngredients, setVisibleIngredients] = useState(20);

    //BASE INGREDIENT
    const renderItem = ({ item, index }) => (
      <View style={{ marginVertical: 5, marginHorizontal: 20 }}>
        <FilterItem
          label={item.strIngredient1}
          onPress={() => selectFilter(index, item.strIngredient1)}
          checked={multiFilterSelectColor(index) === 'green'}
          colors={colors}
          fonts={fonts}
        />
      </View>
    );

    return (
      <View>
        {showDropdown2 && (
          <View style={styles.dropdownList}>
            <FlatList
              data={ingredientJson.slice(0, visibleIngredients)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              onEndReached={() => setVisibleIngredients((prev) => prev + 20)}
              onEndReachedThreshold={0.2}
            />
          </View>
        )}
      </View>
    );
  };

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
            <TouchableOpacity
              key={'filterbtn'}
              style={[styles.filterBtn, { backgroundColor: filterView ? '#CEC56F' : 'transparent', borderWidth: filterView ? 0 : 1 }]}
              onPress={() => viewFilter()}>
              <Text style={[textStyles.button, { color: filterView ? 'white' : colors.mainFontColour }]}>Filters</Text>
            </TouchableOpacity>
          </Col>
        </Row>
      </View>

      {filterView ? (
        <ScrollView style={styles.filterScrollView}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#CEC56F' }}>
            <View style={[styles.filterHeader, { marginHorizontal: 20, marginVertical: 10 }]}>
              <TouchableOpacity
                onPress={resetFilters}>
                <Icon name={'restore'} size={25} color={colors.mainFontColour} />
              </TouchableOpacity>

              <Text style={styles.filterHeading}>Filters</Text>

              <TouchableOpacity
                onPress={() => activate(filterCondition, filterSearch, firstMultiFilter)}
                style={styles.applyBtn}>
                <Text style={textStyles.button}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.filterHeading}>Sort</Text>

            <View style={styles.filterContainer}>
              <View style={{ gap: 5 }}>
                <FilterItem
                  label="Name A-Z"
                  onPress={() => setSort('asc', 0)}
                  checked={sortColor(0) === colors.mainFontColour}
                  colors={colors}
                  fonts={fonts}
                />

                <FilterItem
                  label="Name Z-A"
                  onPress={() => setSort('desc', 1)}
                  checked={sortColor(1) === colors.mainFontColour}
                  colors={colors}
                  fonts={fonts}
                />

              </View>

              <View style={{ gap: 5 }}>
                <FilterItem
                  label="Alcoholic"
                  index={0}
                  onPress={() => {
                    searchFilter(0, 'a', 'Alcoholic');
                  }}
                  checked={selectedAlcohol[0]}
                  colors={colors}
                  fonts={fonts}
                />

                <FilterItem
                  label="Non-Alcoholic"
                  index={1}
                  onPress={() => {
                    searchFilter(1, 'a', 'Non Alcoholic');
                  }}
                  checked={selectedAlcohol[1]}
                  colors={colors}
                  fonts={fonts}
                />
              </View>

            </View>

          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: '#CEC56F' }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#CEC56F' }}>
              <View style={[styles.dropdownContainer, { marginVertical: 10, marginHorizontal: 20 }]}>
                <Text style={styles.filterHeading}>Categories</Text>

                <TouchableOpacity onPress={toggleCategoryDropdown} style={styles.dropdownHeader}>
                  <Icon name={showDropdown1 ? 'minus' : 'plus'} size={40} color={colors.mainFontColour} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ borderBottomWidth: showDropdown1 ? 1 : 0, marginTop: showDropdown1 ? 10 : 0 }}>
              <View style={{ marginHorizontal: 20 }}>
                {categoryDropdownContent}
              </View>
            </View>

          </View>

          <View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#CEC56F' }}>
              <View style={[styles.dropdownContainer, { marginVertical: 10, marginHorizontal: 20 }]}>
                <Text style={styles.filterHeading}>Base Ingredients</Text>

                <TouchableOpacity onPress={toggleIngredientDropdown} style={styles.dropdownHeader}>
                  <Icon name={showDropdown2 ? 'minus' : 'plus'} size={40} color={colors.mainFontColour} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ borderBottomWidth: showDropdown2 ? 1 : 0, marginTop: showDropdown2 ? 10 : 0 }}>
              <RenderIngredientDropdownContent
                ingredientJson={ingredientJson}
                showDropdown2={showDropdown2}
                selectFilter={selectFilter}
                multiFilterSelectColor={multiFilterSelectColor}
                colors={colors}
                fonts={fonts}
              />
            </View>
          </View>

        </ScrollView>
      ) : 
      <View>
        {!isAPIbusy ? (
          <>
            {errorStatus.trim().length === 0 ? (
              <FlatList
                data={activeDrinks.slice(0, visibleItems)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderDrinkItem}
                extraData={activeDrinks}
                onEndReached={() => setVisibleItems((prev) => prev + 10)}
                onEndReachedThreshold={0.2}
              />
            ) : (
              <View>
                <Text>{errorStatus}</Text>
              </View>
            )}</>
        ) : (<ActivityIndicator size={250} color={"#c0c0c0"}/>)
        }  
      </View >
      }
    </View>
  );
}