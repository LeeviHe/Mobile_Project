import { Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Row, Col } from "react-native-flex-grid";
import { colors, padding, textStyles } from '../styles/style-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/styles';
import { URL } from '../reusables/Constants';

export default function Ingredients({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientData, setIngredientData] = useState([])
  const [errorStatus, setErrorStatus] = useState('')
  const [selectStar, setSelectStar] = useState(false)

  const toggleStar = () => {
    setSelectStar(!selectStar);
  };

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      defaultSetup()
    } else {
      handleSearch()
    }
  }, [searchQuery])

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

  const ingredient = ingredientData.map((data, id) => {
    return (
      <View key={id} style={styles.drinkContainer}>
        <TouchableOpacity
          style={[styles.cocktail, { backgroundColor: '#999' }]}
          onPress={() =>
            navigation.navigate('Ingredient', {
              ingrId: data.idIngredient,
              ingrName: data.strIngredient,
              ingrImg: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png'
            })}>

          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image
              source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png' }}
              style={styles.drinkImg} />

            <View style={styles.cocktailInfo}>
              <Text style={styles.drinkText}>{data.strIngredient}</Text>
              {data.strType && (
                <Text style={styles.drinkText}>{data.strType}</Text>
              )}
            </View>
          </View>

          <View style={{ marginRight: 40 }}>
            <TouchableOpacity onPress={toggleStar}>
              <Icon name={selectStar ? 'star' : 'star-outline'} size={40} color="#e7c500" />
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </View>
    )

  })


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

      <ScrollView>
        {errorStatus.trim().length === 0 ?
          <View>
            {ingredient}
          </View>
          :
          <View>
            <Text>{errorStatus}</Text>
          </View>}
      </ScrollView>

    </View>
  );
}