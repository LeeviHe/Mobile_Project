import { Text, View, TouchableOpacity, Image, Pressable, FlatList, Modal } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, textStyles, modalStyle } from '../styles/style-constants';
import { Row, Col } from "react-native-flex-grid";
import { URL } from '../reusables/Constants';
import { ScrollView } from 'react-native-virtualized-view'
import { useFavourites } from './FavouritesContext';

export default function MyPockettinis({ navigation, route }) {
  const [cocktailView, setCocktailView] = useState(false);
  const [ingredientView, setIngredientView] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null)

  //Modal
  const [modal, setModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [linkText, setLinkText] = useState('')

  // Favouriting functions from context
  const { favouritesData, removeFavourite, ownedData, setOwnedData, removeOwned } = useFavourites()
  // To replace strCategory in filtering situation
  const [replaceCategory, setReplaceCategory] = useState('')
  //Selected ingredients index
  const [selectedItemsIndex, setSelectedItemsIndex] = useState(new Array(ownedData.length).fill(false))
  //Selected ingredients names
  const [selectedItems, setSelectedItems] = useState([])
  // Drinks available with selectedItems
  const [availableRecipes, setAvailableRecipes] = useState([])

  useEffect(() => {
    let string = selectedItems.toString()
    if (selectedItems.length === 0) {
      setErrorStatus('No ingredients selected!')
      setAvailableRecipes([])
    } else {
      getDrinks('filter.php?i=' + string, string)
    }
  }, [selectedItems, ownedData])

  const navToFav = () => {
    navigation.navigate('MoreNavigator', {
      screen: 'Favourites',
    });
  };

  async function getDrinks(method, ingr) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
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
        setReplaceCategory(ingr)
      } else {
        alert('Error retrieving recipes!');
      }
    } catch (err) {
      alert(err);
    }
  }

  function multiSelectColor(i) {
    return selectedItemsIndex[i] ? 'green' : 'red'
  }

  const renderItem = ({ item, index }) => {
    const isOwned = true
    const checked = multiSelectColor(item.idIngredient) === 'green';

    const toggleStar = async () => {
      try {
        if (isOwned) {
          removeOwned(item.idIngredient)
          setModal(true)
          setModalText('Removed from owned ingredients')
          setLinkText('')
          setTimeout(() => {
            setModal(false)
          }, 1000);
          setSelectedItems(oldValues => {
            return oldValues.filter(checked => checked !== item.strIngredient)
          })
          }
        } catch (error) {
          console.error('Error saving ingredient: ' + error)
          setOwnedData((prevOwned) =>
            prevOwned.filter((own) => own.idIngredient !== item.idIngredient))
      }
    }

    return (
        <Col style={styles.myCol}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
            <TouchableOpacity onPress={toggleStar}>
              <Icon name={isOwned ? 'star' : 'star-outline'} size={30} color="#e7c500" />
            </TouchableOpacity>

            <Pressable style={styles.myBtn} onPress={() => selectItems(item.idIngredient, item.strIngredient)}>
              <Icon name='check' size={18} color={checked ? colors.mainFontColour : 'transparent'} />
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', gap: 10, paddingHorizontal: 5, minWidth:20, maxWidth: 'auto' }}>
            <Image
              source={
                item.strType
                  ? { uri: 'https://www.thecocktaildb.com/images/ingredients/' + item.strIngredient + '.png' }
                  : require('../assets/images/img-placeholder.jpg')
              }
              style={styles.drinkImg}
            />
            <Text style={{ fontFamily: fonts.text, flexWrap: "wrap", width: 83 }}>{item.strIngredient.length > 15 ? item.strIngredient.substring(0, 15) + '..' : item.strIngredient}</Text>
          </View>
        </Col>
    )
  }

  const selectItems = (index, item) => {
    let selected = [...selectedItemsIndex]
    selected[index] = selectedItemsIndex[index] ? false : true
    setSelectedItemsIndex(selected)

    if (selectedItemsIndex[index]) {
      setSelectedItems(oldValues => {
        return oldValues.filter(checked => checked !== item)
      })
    } else {
      let ItemCopy = [...selectedItems]
      ItemCopy.push(item)
      setSelectedItems(ItemCopy)
    }
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
    const isFavourited = favouritesData.some((fav) => fav.idDrink === item.idDrink)

    const toggleHeart = async () => {
      if (isFavourited) {
        removeFavourite(item.idDrink)
        setModal(true)
        setModalText('Removed from favourites')
        setLinkText('')
        setTimeout(() => {
          setModal(false)
        }, 1000);
      }
    }

    return (
      <View style={styles.drinkContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.cocktail, { backgroundColor: '#98b5c280' }]}
          onPress={() =>
            navigation.navigate('CocktailsNavigator',
              {
                screen: 'Cocktails', params: {
                  condition: 'navfix',
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
              <Text style={styles.drinkText} numberOfLines={1}>{replaceCategory}</Text>
            </View>

          </View>

          <View style={{ marginRight: 40 }}>
            <TouchableOpacity onPress={toggleHeart}>
              {isFavourited ?
                <Icon name={'heart'} size={35} color="#ff6161" />
                :
                <></>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
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
                <Text style={{ color: colors.white }}>{ownedData.length}</Text>
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

      {!cocktailView ? (
          <ScrollView style={{ height: '100%', marginHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Owned ingredients</Text>
            {ownedData.length === 0 ?
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>No ingredients saved!</Text>
                <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>Your starred items will show here.</Text>
              </View>
              :
                <FlatList
                  data={ownedData}
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
            }
          </ScrollView>

      ) : (

        <View style={{ backgroundColor: colors.white, marginBottom: 570 }}>
          <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10, marginHorizontal: 20 }}>Possible recipes</Text>
          {errorStatus ?
            <View style={{ alignItems: 'center', marginTop: 20, marginHorizontal: 40 }}>
              <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>{errorStatus}</Text>
              <Text></Text>
              <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour, textAlign: 'center' }}>Choosing different drinks will display relevant recipes here.</Text>
            </View>
            :
            <View style={styles.drinkContainer}>
              <FlatList
                data={availableRecipes}
                renderItem={renderDrinkItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          }
        </View>)}

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
    </ScrollView>
  )
}