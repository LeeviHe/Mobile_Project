import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, Image, Pressable, FlatList } from 'react-native';
import styles from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts } from '../styles/style-constants';
import { Col, Row } from 'react-native-flex-grid';
import { getJsonIngredients, getJsonDrinks } from '../reusables/Functions';
import { URL, OWNED_INGR_KEY } from '../reusables/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ingredient = ({ navigation, route }) => {
  const [ingredientData, setIngredientData] = useState([]);
  const [ingredientDrinks, setIngredientDrinks] = useState([]);
  const [owned, setOwned] = useState([])

  useEffect(() => {
    console.log('route change: ' + route.params.idIngredient + " " + route.params.ingrName)
    getJsonIngredients(URL, 'lookup.php?iid=' + route.params.idIngredient, setIngredientData);
    getJsonDrinks(URL, 'filter.php?i=' + route.params.ingrName, setIngredientDrinks);
  }, [route]);

  useEffect(() => {
    const unsubsribe = navigation.addListener('focus', () => {
      getOwnedData()
    })
    return unsubsribe
  }, [route.params, navigation])

  const getOwnedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(OWNED_INGR_KEY)
      if (jsonValue !== null) {
        let tmp = JSON.parse(jsonValue)
        setOwned(tmp)
      }
    }
    catch (e) {
      console.log('Read error: ' + e)
    }
  }

  const isOwned = owned.some(own => own.idIngredient === route.params.idIngredient)

  const toggleStar = async () => {
    try {
      console.log(ingredientData[0].idIngredient)
      if (isOwned) {
        const newOwned = owned.filter((own) => own.idIngredient !== ingredientData[0].idIngredient)
        await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
        setOwned(newOwned)
        alert('Ingredient removed from owned')
      } else {
        const newKey = owned.length + 1
        const ingrInfo = {
          key: newKey,
          idIngredient: ingredientData[0].idIngredient,
        }
        const newOwned = [...owned, ingrInfo]
        await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
        setOwned(newOwned)
        alert('Ingredient saved')
      }
    } catch (error) {
      console.log('Error saving ingredient: ' + error)
      setOwned((prevOwned) =>
        prevOwned.filter((own) => own.idIngredient !== ingredientData[0].idIngredient))
    }
    //
    console.log(owned.length)
  }

  const renderDrinkItem = ({ item, index }) => {
    return (
      <Col style={{ gap: 5 }}>
        <TouchableOpacity
          key={index}
          style={[styles.shadow, { backgroundColor: 'white', borderRadius: 5 }]}
          onPress={() =>
            navigation.navigate('CocktailsNavigator',
              {
                screen: 'Recipe',
                params: {
                  drinkId: item.idDrink,
                  drinkName: item.strDrink,
                  image: item.strDrinkThumb,
                  navigator: 'IngredientsNavigator',
                  screen: 'Ingredients',
                }
              }
            )
          }>

          <Image
            style={{ width: 150, height: 150, borderRadius: 5 }} source={{ uri: item.strDrinkThumb }} />

        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontFamily: fonts.secondary }}>
          {item.strDrink.length > 16 ? item.strDrink.substring(0, 16) + '..' : item.strDrink}
        </Text>
      </Col>
    )
  };

  return (
    <View style={styles.recipeContainer}>
      <StatusBar hidden={true} />
      {ingredientData.map((data, id) => (
        <View key={id} >
          <ImageBackground
            source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png' }}
            resizeMode="cover"
            opacity={0.5}
            blurRadius={20}
            style={{ paddingVertical: 30 }}>

            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.navigate('Ingredients')}>
                <Icon name="chevron-left" size={30} color={colors.mainFontColour} />
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleStar}>
                <Icon name={isOwned ? 'star' : 'star-outline'} size={40} color="#e7c500" />
              </TouchableOpacity>
            </View>
            <View>

              <View style={styles.drinkInfo}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.drinkName}>{data.strIngredient}</Text>
                  <Text style={styles.drinkCategory}>{data.strType}</Text>
                </View>
                <View>
                  <Image
                    style={{ width: 300, height: 300 }}
                    source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png' }}
                  />
                </View>
              </View>

            </View>
          </ImageBackground>
        </View>))}

      <View style={{ marginVertical: 10 }}>
        <FlatList
          data={ingredientDrinks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDrinkItem}
          horizontal
          contentContainerStyle={{ justifyContent: 'space-around' }}
        />
      </View>

    </View>
  );
};

export default Ingredient;
