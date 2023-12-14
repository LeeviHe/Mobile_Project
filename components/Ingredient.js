import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, Image, FlatList, Modal} from 'react-native';
import styles from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts, modalStyle } from '../styles/style-constants';
import { Col } from 'react-native-flex-grid';
import { getJsonIngredients, getJsonDrinks } from '../reusables/Functions';
import { URL } from '../reusables/Constants';
import { useFavourites } from './FavouritesContext';

const Ingredient = ({ navigation, route }) => {
  const [ingredientData, setIngredientData] = useState([]);
  const [ingredientDrinks, setIngredientDrinks] = useState([]);
  const [modal, setModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [linkText, setLinkText] = useState('')

  const {ownedData, setOwnedData, addOwned, removeOwned} = useFavourites()

  useEffect(() => {
    console.log('route change: ' + route.params.idIngredient + " " + route.params.ingrName)
    getJsonIngredients(URL, 'lookup.php?iid=' + route.params.idIngredient, setIngredientData);
    getJsonDrinks(URL, 'filter.php?i=' + route.params.ingrName, setIngredientDrinks);
  }, [route]);

  const isOwned = ownedData.some(own => own.idIngredient === route.params.idIngredient)

  const toggleStar = async () => {
    try {
      if (isOwned) {
        removeOwned(route.params.idIngredient)
        setModal(true)
        setModalText('Removed from owned ingredients')
        setLinkText('')
        setTimeout(() => {
          setModal(false)
        }, 1000);
      } else {
        const newKey = ownedData.length + 1
        const ingrInfo = {
          key: newKey,
          idIngredient: ingredientData[0].idIngredient,
          strIngredient: ingredientData[0].strIngredient,
          strType: ingredientData[0].strType
        }
        addOwned(ingrInfo)
        setModal(true)
          setModalText('Added to ')
          setLinkText('owned ingredients')
          setTimeout(() => {
            setModal(false)
          }, 2000);
      }
    } catch (error) {
      console.log('Error saving ingredient: ' + error)
      setOwnedData((prevOwned) =>
        prevOwned.filter((own) => own.idIngredient !== ingredientData[0].idIngredient))
    }
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
        { item.strDrink ?
        <Text style={{ textAlign: 'center', fontFamily: fonts.secondary }}>
          {item.strDrink.length > 16 ? item.strDrink.substring(0, 16) + '..' : item.strDrink}
        </Text>
        : <Text>No drinks include this ingredient</Text>}
      </Col>
    )
  };

  return (
    <View style={styles.recipeContainer}>
      <StatusBar hidden={true} />
      {ingredientData.map((data, id) => (
        <View key={id} >
          <ImageBackground
            source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strIngredient + '.png' }}
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
                    source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strIngredient + '.png' }}
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
                  onPress={() => navigation.navigate('MyIngredients')}>
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
  );
};

export default Ingredient;
