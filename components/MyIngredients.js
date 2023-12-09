import { Text, View, TouchableOpacity, Image, Pressable, FlatList } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import { Row, Col } from "react-native-flex-grid";
import { Searchbar } from 'react-native-paper';
import { URL, OWNED_INGR_KEY } from '../reusables/Constants';
import { getJsonIngredients } from '../reusables/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-virtualized-view'
import { useGlobalState } from '../reusables/Functions';

export default function MyPockettinis( { navigation } ) {
  const [check, setCheck] = useState(false);
  const [cocktailView, setCocktailView] = useState(false);
  const [ingredientView, setIngredientView] = useState(true);
  const [ownedId, setOwnedId] = useState([])
  const [owned, setOwned] = useState([])
  const [temp, setTemp] = useState([])
  const [newInfo, setNewInfo] = useState([])
  const { asyncStorageData } = useGlobalState()

  useEffect (() => {
    const unsubsribe = navigation.addListener('focus', () => {
      getOwnedData()
    })
    return () => {unsubsribe()}
  }, [asyncStorageData])

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
    }
  }, [newInfo])

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

  const renderItem = ({ item }) => {
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
      <Pressable style={styles.myBtn} onPress={toggleCheck}>
        <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
      </Pressable>

      <View style={{ alignItems: 'center', gap: 10 }}>
        <Image source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + item.strType + '.png' }} style={styles.drinkImg} />
        <Text>{item.strIngredient}</Text>
      </View>
    </View>
    )
  };

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
                <Text style={{ color: colors.white }}>0</Text>
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
                <Text style={{ color: colors.white }}>0</Text>
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

      {cocktailView && (
        <ScrollView style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Possible cocktails</Text>

          <View style={styles.drinkContainer}>
            <TouchableOpacity
              style={[styles.cocktail, { backgroundColor: 'lightblue' }]}>

              <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <Image source={require('../assets/images/CoffeeTea-category.png')} style={styles.drinkImg} />

                <View style={styles.cocktailInfo}>
                  <Text style={styles.drinkText}>drink name</Text>
                  <Text style={styles.drinkText}>category</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  )
}