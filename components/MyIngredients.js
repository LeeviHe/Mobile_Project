import { Text, View, TouchableOpacity, Image, Pressable, FlatList, ActivityIndicator } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { Row, Col } from "react-native-flex-grid";
import { URL, OWNED_INGR_KEY, FAVOURITE_DRINKS_KEY } from '../reusables/Constants';
import { getJsonIngredients } from '../reusables/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-virtualized-view'
import { useGlobalState } from '../reusables/Functions';

export default function MyPockettinis({ navigation, route }) {
  const [cocktailView, setCocktailView] = useState(false);
  const [ingredientView, setIngredientView] = useState(true);
  const [ownedId, setOwnedId] = useState([])
  const [owned, setOwned] = useState([])
  const [temp, setTemp] = useState([])
  const [newInfo, setNewInfo] = useState([])
  const { asyncStorageData } = useGlobalState()
  const [errorStatus, setErrorStatus] = useState(null)
  const [isAsyncbusy, setAsyncBusy] = useState(false)

  // Iteration of favourited drinks
  const [favourites, setFavourites] = useState([])
  //Selected ingredients index
  const [selectedItemsIndex, setSelectedItemsIndex] = useState(new Array(newInfo.length).fill(false))
  //Selected ingredients names
  const [selectedItems, setSelectedItems] = useState([])
  // Drinks available with selectedItems
  const [availableRecipes, setAvailableRecipes] = useState([])

  useEffect(() => {
    const unsubsribe = navigation.addListener('focus', () => {
      getOwnedData()
    })
    return () => { unsubsribe() }
  }, [asyncStorageData])

  useEffect(() => {
    let string = selectedItems.toString()
    if (selectedItems.length === 0) {
      setErrorStatus('No ingredients selected!')
      setAvailableRecipes([])
    } else {
      getDrinks('filter.php?i=' + string)
    }
  }, [selectedItems])

  useEffect(() => {
    const fetchData = async () => {
      if (ownedId) {
        setAsyncBusy(true)
        const fetchPromises = ownedId.map(own => 
          getJsonIngredients(URL, 'lookup.php?iid=' + own.idIngredient, setTemp)
        )
        try {
          const results = await Promise.all(fetchPromises)
          const tempData = results.flat()
          if (tempData) {
            setNewInfo(tempData)
          } else {
            console.log('No tempData')
          }
        } catch (e) {
          console.log('error fetching and updating')
        }
      }
      setAsyncBusy(false)
    }
    fetchData();
  }, [ownedId])

  useEffect(() => {
    if (newInfo.length > 0) {
      setOwned(newInfo)
    }
  }, [newInfo])
  
  useEffect(() => {
    const unsubsribe = navigation.addListener('focus', () => {
      getFavouriteData()
    })
    return unsubsribe
  }, [navigation])

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

  async function getDrinks(method) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        console.log(method)
        const json = await response.json();
        if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks || json.drinks === "None Found") {
          setErrorStatus('No drinks found!')
          setAvailableRecipes([])
          return
        } else {
          setErrorStatus(null)
        }
        const drinks = json.drinks;
        setAvailableRecipes(drinks);
      } else {
        alert('Error retrieving recipes!');
      }
    } catch (err) {
      alert(err);
    }
  }

  const getOwnedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(OWNED_INGR_KEY)
      if (jsonValue !== null) {
        let data = JSON.parse(jsonValue)
        setOwnedId(data)
      } else {
        console.log('No data found in Async')
        setOwnedId([])
      }
    }
    catch (e) {
      console.log('Read error: ' + e)
    }
  }

  function multiSelectColor(i) {
    return selectedItemsIndex[i] ? 'green' : 'red'
  }

  const renderItem = ({ item, index }) => {
    const isOwned = true
    const checked = multiSelectColor(index) === 'green';

    const toggleStar = async () => {
      try {
        if (isOwned) {
          const newOwned = owned.filter((own) => own.idIngredient !== item.idIngredient)
          setOwned(newOwned)
          const newOwnedId = ownedId.filter((own) => own.idIngredient !== item.idIngredient);
          setOwnedId(newOwnedId);
          selectItems(index, item.strIngredient)
          await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
          alert('Ingredient removed from owned')
        }
      } catch (error) {
        console.log('Error saving ingredient: ' + error)
        setOwned((prevOwned) =>
          prevOwned.filter((own) => own.idIngredient !== item.idIngredient))
      }
    }

    return (
      <Col style={styles.myCol}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity onPress={toggleStar}>
            <Icon name={isOwned ? 'star' : 'star-outline'} size={30} color="#e7c500" />
          </TouchableOpacity>

          <Pressable style={styles.myBtn} onPress={() => selectItems(index, item.strIngredient)}>
            <Icon name='check' size={18} color={checked ? colors.mainFontColour : 'transparent'} />
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', gap: 10, paddingHorizontal: 5 }}>
          <Image
            source={
              item.strType
                ? { uri: 'https://www.thecocktaildb.com/images/ingredients/' + item.strType + '.png' }
                : require('../assets/images/img-placeholder.jpg')
            }
            style={styles.drinkImg}
          />
          <Text style={{ fontFamily: fonts.text }}>{item.strIngredient}</Text>
        </View>
      </Col>
    )
  }

  const selectItems = (index, item) => {
    let selected = [...selectedItemsIndex]
    selected[index] = selectedItemsIndex[index] ? false : true
    setSelectedItemsIndex(selected)

    if (selectedItemsIndex[index]) {
      console.log('splice')
      setSelectedItems(oldValues => {
        return oldValues.filter(checked => checked !== item)
      })
    } else {
      console.log('push')
      let ItemCopy = [...selectedItems]
      ItemCopy.push(item)
      setSelectedItems(ItemCopy)
    }
    console.log(selectedItems)
  }

  const viewCocktails = () => {
    setCocktailView(true);
    setIngredientView(false);
  };

  const viewIngredients = () => {
    setCocktailView(false);
    setIngredientView(true);
  };

  const renderDrinkItem = ({ item, index }) => {
    const isFavourited = favourites.some((fav) => fav.drinkId === item.idDrink)

    const toggleHeart = async () => {
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
      } catch (error) {
        console.log('Error saving favourite: ' + error)
        setFavourites((prevFavourites) =>
          prevFavourites.filter((fav) => fav.drinkId !== item.idDrink)
        )
      }
    }

    return (
      <View style={styles.drinkContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.cocktail, { backgroundColor: 'pink' }]}
          onPress={() =>
            navigation.navigate('CocktailsNavigator',
              {
                screen: 'Recipe', params: {

                  drinkId: item.idDrink,
                  drinkName: item.strDrink,
                  image: item.strDrinkThumb,
                  category: item.strCategory,
                  glass: item.strGlass,
                  instructions: item.strInstructions,
                  navigator: 'IngredientsNavigator',
                  screen: 'MyIngredients'
                }
              })
          }>

          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image source={{ uri: item.strDrinkThumb }} style={styles.drinkImg} />

            <View style={styles.cocktailInfo}>
              <Text style={styles.drinkText} numberOfLines={1} ellipsizeMode="tail">
                {item.strDrink}
              </Text>
              <Text style={styles.drinkText}>{item.strCategory}</Text>
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

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Ingredients</Text>

      <View style={{ marginBottom: 20 }}>
        <Row>
          <Col style={ingredientView ? styles.topIngrColActive : styles.topIngrCol}>
            <TouchableOpacity
              onPress={viewIngredients}
              style={{ flexDirection: 'row', gap: 10 }}>

              <Text fontFamily={fonts.header}
                style={{
                  fontSize: 16,
                  color: ingredientView ? colors.mainFontColour : '#ccc',
                  fontFamily: fonts.header
                }}>Ingredients
              </Text>

              <View style={styles.topIngrNbr}
                backgroundColor={ingredientView ? '#333' : '#ddd'}>
                <Text style={{ color: colors.white }}>{ownedId.length}</Text>
              </View>

            </TouchableOpacity>
          </Col>

          <Col style={cocktailView ? styles.topIngrColActive : styles.topIngrCol}>
            <TouchableOpacity
              onPress={viewCocktails}
              style={{ flexDirection: 'row', gap: 10 }}>

              <Text fontFamily={fonts.header} style={{
                fontSize: 16,
                color: cocktailView ? colors.mainFontColour : '#ccc',
                fontFamily: fonts.header
              }}>Drinks</Text>

              <View style={styles.topIngrNbr}
                backgroundColor={cocktailView ? '#333' : '#ddd'}>
                <Text style={{ color: colors.white }}>{availableRecipes.length}</Text>
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
      </View>

      
        <ScrollView style={{ height: '100%' }}>

          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Owned ingredients</Text>
              {!isAsyncbusy ? (
                <FlatList
                  data={owned}
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (<ActivityIndicator size={250} color={"#c0c0c0"}/>)}
          </View>
        </ScrollView>
      

      {cocktailView &&
        <View style={{ marginTop: 20, height: '100%', backgroundColor: colors.white }}>
          <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10, marginHorizontal: 20 }}>Possible recipes</Text>
          {errorStatus ?
            <Text style={{ textAlign: 'center', marginTop: 20 }}>{errorStatus}</Text>
            :
            <View style={styles.drinkContainer}>
              <FlatList
                data={availableRecipes}
                renderItem={renderDrinkItem}
                keyExtractor={(item, index) => index.toString()}
                extraData={availableRecipes}
              />
            </View>
          }
        </View>
      }
    </View>
  )
}