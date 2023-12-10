import { Text, View, TouchableOpacity, Image, Pressable, FlatList } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import { Row, Col } from "react-native-flex-grid";
import { Searchbar } from 'react-native-paper';
import { URL, OWNED_INGR_KEY, FAVOURITE_DRINKS_KEY } from '../reusables/Constants';
import { getJsonIngredients } from '../reusables/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-virtualized-view'
import { useGlobalState } from '../reusables/Functions';

export default function MyPockettinis( { navigation, route } ) {
  const [check, setCheck] = useState(false);
  const [cocktailView, setCocktailView] = useState(false);
  const [ingredientView, setIngredientView] = useState(true);
  const [ownedId, setOwnedId] = useState([])
  const [owned, setOwned] = useState([])
  const [temp, setTemp] = useState([])
  const [newInfo, setNewInfo] = useState([])
  const { asyncStorageData } = useGlobalState()
  const [errorStatus, setErrorStatus] = useState(null)

    // Iteration of favourited drinks
    const [favourites, setFavourites] = useState([])
  //Selected ingredients index
  const [selectedItemsIndex, setSelectedItemsIndex] = useState([])
  //Selected ingredients names
  const [selectedItems, setSelectedItems] = useState([])
  // Drinks available with selectedItems
  const [availableRecipes, setAvailableRecipes] = useState([])

  useEffect (() => {
    const unsubsribe = navigation.addListener('focus', () => {
      getOwnedData()
    })
    return () => {unsubsribe()}
  }, [asyncStorageData])

  useEffect(() => {
    let string = selectedItems.toString()
    if (selectedItems.length === 0) {
      console.log('Non selected')
      setErrorStatus('No ingredients selected')
      setAvailableRecipes([])
    } else {
      getDrinks('filter.php?i=' + string)
    }
  }, [selectedItems])

  useEffect (() => {
      console.log(ownedId.length)
      const fetchData = async () => {
        let tempData = []
        for (let i = 0; i < ownedId.length; i++) {
          try {
            const result = await getJsonIngredients(URL, 'lookup.php?iid=' + ownedId[i].idIngredient, setTemp)
            tempData = [...tempData, ...result]
          } catch(e) {
            console.log('error fetching and updating')
          }
        }
        if (tempData) {
          setNewInfo(tempData)
        } else {
          console.log('No tempData')
        }
      }
      fetchData()
  }, [ownedId])

  useEffect (() => {
    if (newInfo.length > 0) {
      setOwned(newInfo)
      setSelectedItemsIndex(new Array(newInfo.length).fill(false))
    }
  }, [newInfo])

  useEffect (() => {
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
          }
      }
      catch (e) {
          console.log('Read error: ' + e)
      }
  }

  const renderItem = ({ item, index }) => {
    const isOwned = true
    
    const toggleStar = async() => {
        try {
            if (isOwned) {
              const newOwned = owned.filter((own) => own.idIngredient !== item.idIngredient)
              setOwned(newOwned)
              const newOwnedId = ownedId.filter((own) => own.idIngredient !== item.idIngredient);
              setOwnedId(newOwnedId);
              await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
              alert('Ingredient removed from owned')
            }
        } catch(error) {
            console.log('Error saving ingredient: ' + error)
            setOwned((prevOwned) => 
            prevOwned.filter((own) => own.idIngredient !== item.idIngredient))
        }
    }
    
    return (
    <View >
      <TouchableOpacity onPress={toggleStar}>
        <Icon name={isOwned ? 'star' : 'star-outline'} size={30} color="#e7c500" />
      </TouchableOpacity>
      <Pressable style={styles.myBtn} onPress={() => selectItems(index, item.strIngredient)}>
        <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
      </Pressable>

      <View style={{ alignItems: 'center', gap: 10 }}>
        <Image source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + item.strType + '.png' }} style={styles.drinkImg} />
        <Text>{item.strIngredient}</Text>
      </View>
    </View>
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

  const toggleCheck = () => {
    setCheck(!check);
  };

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
    };

    return (
      <View style={styles.drinkContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.cocktail, { backgroundColor: 'pink' }]}
          onPress={() =>
            navigation.navigate('Recipe', {
              drinkId: item.idDrink,
              drinkName: item.strDrink,
              image: item.strDrinkThumb,
              category: item.strCategory,
              glass: item.strGlass,
              instructions: item.strInstructions,
              screen: 'MyIngredients'
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
                <Text style={{ color: colors.white }}>{selectedItems.length}</Text>
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
              }}>Cocktails</Text>

              <View style={styles.topIngrNbr}
                backgroundColor={cocktailView ? '#333' : '#ddd'}>
                <Text style={{ color: colors.white }}>{availableRecipes.length}</Text>
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
      </View>

      {ingredientView && (
        <ScrollView>
          <View style={{ marginBottom: 50 }}>
            <Searchbar
              placeholder="Search"
              style={styles.ingrSearch}
              inputStyle={{ marginTop: -10 }}
              iconColor={colors.mainFontColour}
              placeholderTextColor={colors.mainFontColour}
            />
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Name of type</Text>

            <Row style={styles.myRow}>
              <Col style={styles.myCol}>
                <FlatList
                  data={owned}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
               </Col>
            </Row>

            <Row style={styles.myRow}>
              <Col style={styles.myCol}>
                <Pressable style={styles.myBtn} onPress={toggleCheck}>
                  <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
                </Pressable>

                <View style={{ alignItems: 'center', gap: 10 }}>
                  <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                  <Text>Name</Text>
                </View>
              </Col>

              <Col style={styles.myCol}>
                <Pressable style={styles.myBtn} onPress={toggleCheck}>
                  <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
                </Pressable>

                <View style={{ alignItems: 'center', gap: 10 }}>
                  <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                  <Text>Name</Text>
                </View>
              </Col>

              <Col style={styles.myCol}>
                <Pressable style={styles.myBtn}>
                  <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
                </Pressable>

                <View style={{ alignItems: 'center', gap: 10 }}>
                  <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                  <Text>Name</Text>
                </View>
              </Col>
            </Row>
          </View>
        </ScrollView>
      )}

      {cocktailView && 
        <View>
          <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Possible cocktails</Text>
          { errorStatus ? 
          <Text>{errorStatus}</Text>
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