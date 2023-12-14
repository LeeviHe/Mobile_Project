import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { colors, textStyles, modalStyle, fonts } from '../styles/style-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/styles';
import { URL } from '../reusables/Constants';
import { useFavourites } from './FavouritesContext';

export default function Ingredients({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientData, setIngredientData] = useState([])
  const [errorStatus, setErrorStatus] = useState('')
  const [isAPIbusy, setAPIBusy] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [linkText, setLinkText] = useState('')

  const {ownedData, setOwnedData, addOwned, removeOwned} = useFavourites()

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      defaultSetup()
    } else {
      handleSearch()
    }
  }, [searchQuery])

  async function getIngredient(method) {
    setAPIBusy(true)
    try {
      const response = await fetch(URL + method);
      if (response.ok) {
        const json = await response.json();
        if (json.ingredients === undefined || json.ingredients === null || json.ingredients === '' || json.ingredients === 0 || !json.ingredients) {
          setErrorStatus('No ingredients found!')
          setIngredientData([])
          setAPIBusy(false)
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
    setAPIBusy(false)
  }

  const handleSearch = () => {
    getIngredient('search.php?i=' + searchQuery)
  }

  const defaultSetup = () => {
    getIngredient('search.php?i=')
  }

  const renderItem = ({ item, index }) => {

    const isOwned = ownedData.some(own => own.idIngredient === item.idIngredient)

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
        } else {
          const newKey = ownedData.length + 1
          const ingrInfo = {
            key: newKey,
            idIngredient: item.idIngredient,
            strIngredient: item.strIngredient,
            strType: item.strType
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
          prevOwned.filter((own) => own.idIngredient !== item.idIngredient))
      }
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
              ingrImg: 'https://www.thecocktaildb.com/images/ingredients/' + item.strIngredient + '.png'
            })
          }>

          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image
              source={
                item.strType
                  ? { uri: 'https://www.thecocktaildb.com/images/ingredients/' + item.strIngredient + '.png' }
                  : require('../assets/images/img-placeholder.jpg')
              }
              style={styles.drinkImg}
            />

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
      {!isAPIbusy ? (<>
        {errorStatus.trim().length === 0 ?
          <FlatList
            data={ingredientData}
            renderItem={renderItem}
            keyExtractor={item => item.idIngredient.toString()}
          />
          :
          <View>
            <Text style={{ fontFamily: fonts.text, color: colors.mainFontColour, alignSelf:'center' }}>{errorStatus}</Text>
          </View>}</>) : (<ActivityIndicator size={250} color={"#c0c0c0"} />)}

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
}