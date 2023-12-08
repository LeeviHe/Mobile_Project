import { Text, View, TouchableOpacity, Image} from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import { FAVOURITE_DRINKS_KEY } from '../reusables/Constants';
import { URL } from '../reusables/Constants';
import { getJsonDrinks } from '../reusables/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { ScrollView } from 'react-native-virtualized-view';

export default function Favourites({ navigation, route}) {
  const [favouritesIds, setFavouritesIds] = useState([])
  const [favourites, setFavourites] = useState([])
  const [temp, setTemp] = useState([])

  async function clear() {
    try { 
      await AsyncStorage.removeItem(FAVOURITE_DRINKS_KEY)
      setFavouritesIds([])
      setFavourites([])
    } catch (e) {
        console.log('Clear error: ' + e)
    }
  }

  useEffect (() => {
    favouriteData()
    const unsubsribe = navigation.addListener('focus', async () => {
      const storedData = await AsyncStorage.getItem(FAVOURITE_DRINKS_KEY)
      //Stops duplication, need more work or delete
      if (storedData == favourites) {
        favouriteData()
      } else {
        console.log('nope')
      }
        
    })
    return () => {unsubsribe()}
  }, [route.params, navigation])


  useEffect (() => {
    console.log(favouritesIds.length)
    const fetchData = async () => {
      for (let i = 0; i < favouritesIds.length; i++) {
        try {
          await getJsonDrinks(URL, 'lookup.php?i=' + favouritesIds[i].drinkId, setTemp)
        } catch(e) {
          console.log('error fetching and updating')
        }
      }
    }
    fetchData()
  }, [favouritesIds])

  useEffect (() => {
    if (temp.length > 0) {
      setFavourites(favourites => [...favourites, ...temp]);
    }
  }, [temp])


  useEffect(() => {
    if(favourites.length > 0 ) {
    }
  }, [favourites])


  const favouriteData = async () => {
    
    try {
        const jsonValue = await AsyncStorage.getItem(FAVOURITE_DRINKS_KEY)
        if (jsonValue !== null) {
            let data = JSON.parse(jsonValue)
            setFavouritesIds(data)
        }
    }
    catch (e) {
        console.log('Read error: ' + e)
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white}}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Favourites</Text>

      <View style={styles.favBtnContainer}>
        <Button icon="camera"onPress={() =>clear()} />
        { favourites.length === 0 ? 
        <Text>No favourites saved</Text> :
        favourites.map((data, id) => (
          <TouchableOpacity
            key={id}
            style={[styles.cocktail, { backgroundColor: colors.purple }]}>
              <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <Image source = {{uri: data.strDrinkThumb}}style={styles.drinkImg} />
              </View>
              <View>
                <Text style={styles.drinkText}>{data.strDrink}</Text>
                <Text style={styles.drinkText}>{data.strCategory}</Text>
              </View>

            <View style={{ marginRight: 40 }}>
              <Icon name='heart' size={40} color="#ff6161" />
            </View>
          </TouchableOpacity>))}
      </View>

    </ScrollView>
  );
}