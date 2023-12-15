import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Modal, KeyboardAvoidingView } from 'react-native';
import { Searchbar, RadioButton } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-virtualized-view'
import { Row, Col } from "react-native-flex-grid";
import { colors, fonts, padding, textStyles, modalStyle } from '../styles/style-constants';
import styles from '../styles/styles';
import { DEVS_FAVOURITES, URL, isAlcoholic, isNotAlcoholic } from '../reusables/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getJsonDrinks, getJsonIngredients } from '../reusables/Functions';
import { useFavourites } from './FavouritesContext';

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
  // Favouriting functions from context
  const { favouritesData, setFavouritesData, addFavourite, removeFavourite } = useFavourites()
  // Search query for multi-ingredient search
  const [filterQuery, setFilterQuery] = useState('')
  // Searched ingredients in the filterview search
  const [searchedIngr, setSearchedIngr] = useState([])
  //Modal
  const [modal, setModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [linkText, setLinkText] = useState('')

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

  useEffect(() => {
    let string = activeFilters.toString()
    if (activeFilters.length === 0) {
      if (route.params !== undefined && route.params.id == 'empty' && !activeCategory && searchQuery.trim().length === 0) {
        setFilterCondition('')
        setFilterSearch('')
      }
    } else if (activeFilters.length !== 0) {
      if (activeFilters.length > 4) {
        alert('Maximum of 4 ingredients at a time')
        setActiveFilters([])
        selectedIngredients.fill(false)
      } else {
        searchFilter('', 'i', string, false)
      }
    }
  }, [activeFilters])

  useEffect(() => {
    if (categoryJson.length === 0) {
      getJsonDrinks(URL, "list.php?c=list", setCategoryJson)
    }
    if (ingredientJson.length === 0) {
      getJsonDrinks(URL, "list.php?i=list", setIngredientJson)
    }
    if (filterQuery.trim().length > 0 && searchedIngr) {
      handleFilterSearch()
    } else {
      setSearchedIngr([])
    }

  }, [categoryJson, ingredientJson, filterQuery])

  useEffect(() => {
    if (route.params !== undefined && route.params.id !== 'empty' && searchQuery.trim().length === 0) {
      if (route.params.condition) {
        if (route.params.condition == 'popular' || route.params.condition == 'latest') {
          getDrink(route.params.search)
        } else if (route.params.condition == 'devs') {
          setRecipeData(DEVS_FAVOURITES)
        } else if (route.params.condition == 'random') {
          navigation.setParams({ id: 'empty' })
          defaultSetup()
          navigation.navigate('CocktailsNavigator', { screen: 'Recipe', params: { search: 'random.php', navigator: 'HomeNavigator', screen: 'Home' } })
        } else if (route.params.condition == 'navfix') {
          navigation.setParams({ id: 'empty' })
          defaultSetup()
          navigation.navigate('CocktailsNavigator',
            {
              screen: 'Recipe', params: {
                drinkId: route.params.drinkId,
                drinkName: route.params.drinkName,
                image: route.params.image,
                category: route.params.category,
                glass: route.params.glass,
                instructions: route.params.instructions,
                navigator: route.params.navigator,
                screen: route.params.screen
              }
            })
        } else {
          searchFilter(route.params.id, route.params.condition, route.params.search, true)
          activate(route.params.condition, route.params.search)
        }
      }
    } else if (searchQuery.trim().length === 0 && activeFilters.length === 0 && !activeCategory && route.params === undefined) {
      defaultSetup()
    } else if (searchQuery.trim().length === 0 && activeFilters.length === 0 && !activeCategory && route.params !== undefined) {
      if (route.params.id !== 'empty') {
        defaultSetup()
      }
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
    } else if (descendSort) {
      setActiveDrinks(recipeData.sort((a, b) => b.strDrink.localeCompare(a.strDrink)))
    } else if (recipeData.length > 0) {
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

  function activate(condition, search) {
    if (condition === 'c' || condition === 'a' || condition == 'i') {
      getDrink('filter.php?' + condition + '=' + search, search)
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

  function sortColor(i) {
    return selectedSort[i] ? colors.mainFontColour : colors.white
  }

  //
  //constants

  //Modal navigation to favourites
  const navToFav = () => {
    navigation.navigate('MoreNavigator', {
      screen: 'Favourites',
    });
  };

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch = () => {
    selectedCategory.fill(false)
    selectedIngredients.fill(false)
    selectedAlcohol.fill(false)
    setActiveFilters([])
    getDrink('search.php?s=' + searchQuery);
  }

  // MULTIFILTER SEARCHBAR
  const onFilterSearch = (query) => {
    setFilterQuery(query)
  }

  const FilterSearchBar = ({ onSearch }) => {
    const [localQuery, setLocalQuery] = useState(''); //keeps keyboard visible, dont move

    const handleTextChange = (query) => {
      setLocalQuery(query);
    };

    const handleSearchPress = () => {
      onSearch(localQuery);
    };

    return (
      <View style={{ flexDirection: 'row', marginHorizontal: 10, justifyContent: 'flex-start', marginBottom: 10 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleTextChange}
          value={localQuery}
          style={styles.filterSearch}
          inputStyle={{ marginTop: -10 }}
          iconColor={colors.mainFontColour}
          placeholderTextColor={colors.mainFontColour}
        />
        <TouchableOpacity title="Search"
          onPress={handleSearchPress}
          style={styles.searchBtn}>
          <Text>Search</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleFilterSearch = () => {
    getJsonIngredients(URL, "search.php?i=" + filterQuery, setSearchedIngr)
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
      setActiveFilters(oldValues => {
        return oldValues.filter(filter => filter !== ingredient)
      })
    } else {
      let filterCopy = [...activeFilters]
      filterCopy.push(ingredient)
      setActiveFilters(filterCopy)
    }
    navigation.setParams({ id: 'empty' })
  }

  const renderDrinkItem = ({ item, index }) => {
    const isFavourited = favouritesData.some((fav) => fav.idDrink === item.idDrink)

    const toggleHeart = async () => {
      try {
        if (isFavourited) {
          removeFavourite(item.idDrink)
          setModal(true)
          setModalText('Removed from favourites')
          setLinkText('')
          setTimeout(() => {
            setModal(false)
          }, 1000);
        } else {
          const newKey = favouritesData.length + 1
          if (item.strCategory === undefined) {
            item.strCategory = replaceCategory
          }
          const drinkInfo = {
            key: newKey,
            idDrink: item.idDrink,
            strDrink: item.strDrink,
            strDrinkThumb: item.strDrinkThumb,
            strCategory: item.strCategory
          }
          addFavourite(drinkInfo)
          setModal(true)
          setModalText('Added to ')
          setLinkText('favourites')
          setTimeout(() => {
            setModal(false)
          }, 2000);
        }
      } catch (error) {
        console.error('Error saving favourite: ' + error)
        setFavouritesData((prevFavourites) =>
          prevFavourites.filter((fav) => fav.drinkId !== item.idDrink)
        )
      }
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
                <Text style={styles.drinkText} numberOfLines={1}>{replaceCategory}</Text>
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
    )

    const renderSingleItem = ({ item, index }) => (
      <View style={{ marginVertical: 5, marginHorizontal: 20 }}>
        <FilterItem
          label={item.strIngredient}
          onPress={() => selectFilter(item.idIngredient - 1, item.strIngredient)}
          checked={multiFilterSelectColor(item.idIngredient - 1) === 'green'}
          colors={colors}
          fonts={fonts}
        />
      </View>
    )

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={{ flex: 1 }}>

        {showDropdown2 && (
          <View style={styles.dropdownList}>

            <FilterSearchBar onSearch={onFilterSearch} />

            {searchedIngr !== null && searchedIngr !== undefined && searchedIngr.length > 0 ?
              <View>
                <FlatList
                  data={searchedIngr}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderSingleItem}
                />
              </View>
              :
              <>
              {filterQuery.length > 0 && !searchedIngr ? (<Text style={{ fontFamily: fonts.text, color: colors.mainFontColour, alignSelf: 'center' }}>No ingredients found.</Text>) 
              : 
              (<FlatList
                data={ingredientJson.slice(0, visibleIngredients)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                onEndReached={() => setVisibleIngredients((prev) => prev + 20)}
                onEndReachedThreshold={0.2}
              />)}</>}
          </View>
        )}
      </KeyboardAvoidingView>
    );
  };

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 250, height: '100%' }}>
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
                onPress={() => activate(filterCondition, filterSearch)}
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

            <View style={{ borderBottomWidth: showDropdown1 ? 1 : 0, marginTop: showDropdown1 ? 10 : 0, paddingBottom: showDropdown2 ? 10 : 0 }}>
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

            <View style={{ borderBottomWidth: showDropdown2 ? 1 : 0, marginTop: showDropdown2 ? 10 : 0, paddingBottom: showDropdown2 ? 10 : 0 }}>
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
        <>
          {!isAPIbusy ? (
            <View style={{ backgroundColor: colors.white, marginBottom: 250 }}>
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
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>{errorStatus}</Text>
                </View>
              )}
            </View>
          ) : (<ActivityIndicator size={250} color={"#c0c0c0"} />)
          }
        </>
      }
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(!modal);
        }}>
        <View style={modalStyle.container}>
          <View style={modalStyle.view}>

            <Text style={modalStyle.text}>
              {modalText}
              {linkText ? (
                <Text
                  style={[modalStyle.linkText, { textDecorationLine: 'underline' }]}
                  onPress={navToFav}>
                  {linkText}
                </Text>
              ) : null}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModal(!modal)}>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}