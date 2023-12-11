import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { colors, textStyles } from '../styles/style-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/styles';
import { OWNED_INGR_KEY, URL } from '../reusables/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Ingredients({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientData, setIngredientData] = useState([])
  const [errorStatus, setErrorStatus] = useState('')
  const [owned, setOwned] = useState([])

  const onChangeSearch = query => setSearchQuery(query);
  async function clear() {
    try {
      await AsyncStorage.removeItem(OWNED_INGR_KEY)
      setOwned([])
    } catch (e) {
      console.log('Clear error: ' + e)
    }
  }
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      defaultSetup()
    } else {
      handleSearch()
    }
  }, [searchQuery])

  useEffect(() => {
    clear()
  }, [])

  useEffect(() => {
    const unsubsribe = navigation.addListener('focus', () => {
      getOwnedData()
    })
    return unsubsribe
  }, [navigation])

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

  async function getIngredient(method) {
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        const json = await response.json();
        if (json.ingredients === undefined || json.ingredients === null || json.ingredients === '' || json.ingredients === 0 || !json.ingredients) {
          setErrorStatus('No ingredients found!')
          setIngredientData([])
          return
        } else {
          setErrorStatus('')
        }
        const ingredients = json.ingredients;
        setIngredientData(ingredients);
      } else {
        alert('Error retrieving ingredients!')
      }
    } catch (err) {
      alert(err);
    }
  }

  const handleSearch = () => {
    getIngredient('search.php?i=' + searchQuery)
  }

  const defaultSetup = () => {
    getIngredient('search.php?i=')
  }

  const renderItem = ({ item, index }) => {

    const isOwned = owned.some(own => own.idIngredient === item.idIngredient)

    const toggleStar = async () => {
      try {
        if (isOwned) {
          const newOwned = owned.filter((own) => own.idIngredient !== item.idIngredient)
          await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
          setOwned(newOwned)
          alert('Ingredient removed from owned')
        } else {
          const newKey = owned.length + 1
          const ingrInfo = {
            key: newKey,
            idIngredient: item.idIngredient,
          }
          const newOwned = [...owned, ingrInfo]
          await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
          setOwned(newOwned)
          alert('Ingredient saved')
        }
      } catch (error) {
        console.log('Error saving ingredient: ' + error)
        setOwned((prevOwned) =>
          prevOwned.filter((own) => own.idIngredient !== item.idIngredient))
      }
      //
      console.log(owned.length)
    }

    return (
      <View style={styles.drinkContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.cocktail, { backgroundColor: '#b5c7b0' }]}
          onPress={() =>
            navigation.navigate('Ingredient', {
              idIngredient: item.idIngredient,
              ingrName: item.strIngredient,
              ingrImg: 'https://www.thecocktaildb.com/images/ingredients/' + item.strType + '.png'
            })
          }>

          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image
              source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + item.strType + '.png' }}
              style={styles.drinkImg} />

            <View style={styles.cocktailInfo}>
              <Text style={styles.drinkText}>{item.strIngredient}</Text>
              {item.strType && (
                <Text style={styles.drinkText}>{item.strType}</Text>
              )}
            </View>
          </View>

          <View style={{ marginRight: 40 }}>
            <TouchableOpacity onPress={toggleStar}>
              <Icon name={isOwned ? 'star' : 'star-outline'} size={40} color="#ffd900" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>Ingredients </Text>
        <TouchableOpacity onPress={() =>
          navigation.navigate('MyIngredients')}>
          <Text style={[textStyles.pageTitle, textStyles.spacingHelp, { color: '#cccccc' }]}>My Ingredients </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 50 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={(value) => { onChangeSearch(value) }}
          value={searchQuery}
          style={styles.ingrSearch}
          inputStyle={{ marginTop: -10 }}
          iconColor={colors.mainFontColour}
          placeholderTextColor={colors.mainFontColour} />
      </View>
      {errorStatus.trim().length === 0 ?
        <FlatList
          data={ingredientData} // Assuming ingredientData is your data array
          renderItem={renderItem}
          keyExtractor={item => item.idIngredient.toString()}
        />
        :
        <View>
          <Text>{errorStatus}</Text>
        </View>}
    </View>
  );
}