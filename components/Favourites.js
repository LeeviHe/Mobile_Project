import { Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator, Modal } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { colors, fonts, textStyles, modalStyle } from '../styles/style-constants';
import { ScrollView } from 'react-native-virtualized-view';
import { useFavourites } from './FavouritesContext';

export default function Favourites({ navigation, route }) {
  const {favouritesData, setFavouritesData, removeFavourite} = useFavourites()
  const [modal, setModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [linkText, setLinkText] = useState('')

  const navToFav = () => {
    navigation.navigate('MoreNavigator', {
      screen: 'Favourites',
    });
  };

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
        }
      } catch (error) {
        console.log('Error saving favourite: ' + error)
        setFavouritesData((prevFavourites) =>
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
      };
    };

    return (
      <View style={styles.drinkContainer}>
        <TouchableOpacity
          key={index}
          style={[styles.cocktail, { backgroundColor: categoryBackgroundColor() }]}
          onPress={() =>
            navigation.navigate('CocktailsNavigator', {
              screen: 'Cocktails', params: {
                condition: 'navfix',
                drinkId: item.idDrink,
                drinkName: item.strDrink,
                image: item.strDrinkThumb,
                category: item.strCategory,
                glass: item.strGlass,
                instructions: item.strInstructions,
                navigator: 'MoreNavigator',
                screen: 'Favourites'
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
    <ScrollView style={{ backgroundColor: colors.white }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Favourites</Text>
      <View style={styles.favBtnContainer}>
          {favouritesData.length === 0 ?
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>No favourites saved!</Text>
              <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour }}>Your favourited items will show here.</Text>
            </View>
            :
            <FlatList
              data={favouritesData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderDrinkItem}
            />
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
    </ScrollView>
  );
}