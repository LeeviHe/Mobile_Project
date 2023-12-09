import { Text, View, TouchableOpacity, Image, FlatList} from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import { FAVOURITE_DRINKS_KEY } from '../reusables/Constants';
import { URL } from '../reusables/Constants';
import { getJsonDrinks} from '../reusables/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { ScrollView } from 'react-native-virtualized-view';
import { useGlobalState } from '../reusables/Functions';

export default function Favourites({ navigation , route }) {
  const [favouritesIds, setFavouritesIds] = useState([])
  const [favourites, setFavourites] = useState([])
  const [temp, setTemp] = useState([])
  const { asyncStorageData } = useGlobalState()
  const [newInfo, setNewInfo] = useState([])

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
    const unsubsribe = navigation.addListener('focus', async () => {
        favouriteData()
    })
    return () => {unsubsribe()}
  }, [asyncStorageData, navigation])


  useEffect (() => {
    console.log(favouritesIds.length)
    const fetchData = async () => {
      let tempData = []
      for (let i = 0; i < favouritesIds.length; i++) {
        try {
          const result = await getJsonDrinks(URL, 'lookup.php?i=' + favouritesIds[i].drinkId, setTemp)
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
  }, [favouritesIds])

  useEffect (() => {
    if (newInfo.length > 0) {
      setFavourites(newInfo)
    }
  }, [newInfo])


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
    const isFavourited = true

    const toggleHeart = async() => {
      try {
        if (isFavourited) {
          const newFavourites = favourites.filter((fav) => fav.drinkId !== item.idDrink)
          setFavourites(newFavourites);
          const newFavouritesIds = favouritesIds.filter((fav) => fav.drinkId !== item.idDrink);
          setFavouritesIds(newFavouritesIds);
          await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavouritesIds))
          alert('Drink removed')
        }
      } catch(error) {
        console.log('Error saving favourite: ' + error)
        setFavourites((prevFavourites) => 
        prevFavourites.filter((fav) => fav.drinkId !== item.idDrink)
        )
      }
    };

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

  return (
    <ScrollView style={{ backgroundColor: colors.white}}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Favourites</Text>

      <View style={styles.favBtnContainer}>
        <Button icon="camera"onPress={() =>clear()} />
        { favouritesIds.length === 0 ? 
        <Text>No favourites saved</Text> 
        :
          <FlatList
            data={favourites}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderDrinkItem}
            extraData={favourites}
          />
        }
        </View>
    </ScrollView>
  );
}