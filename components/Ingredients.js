import { Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Row, Col } from "react-native-flex-grid";
import { colors, padding, textStyles } from '../styles/style-constants';
import styles from '../styles/styles';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

export default function Ingredients({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientData, setIngredientData] = useState([])
  const [errorStatus, setErrorStatus] = useState('')

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
      <View style={styles.drinkContainer}>
        <TouchableOpacity key={id} style={[styles.cocktail, { backgroundColor: 'pink' }]}
          onPress={() => navigation.navigate('Ingredient', {
            ingrId: data.idIngredient,
            ingrName: data.strIngredient,
            ingrImg: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png'
          })}>

          <Image
            source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png' }}
            style={styles.drinkImg} />

          <View style={styles.cocktailInfo}>
            <Text style={styles.drinkText}>{data.strIngredient}</Text>
            {data.strType && (
              <Text style={styles.drinkText}>{data.strType}</Text>
            )}

          </View>

        </TouchableOpacity>
      </View>
    )

  })


  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>Ingredients </Text>

      <View style={{ marginBottom: 50 }}>
        <Row style={styles.searchFilterRow}>
          <Col style={[styles.searchFilterCol, padding.none]}>
            <Searchbar
              placeholder="Search"
              onChangeText={(value) => { onChangeSearch(value) }}
              value={searchQuery}
              style={styles.search}
              inputStyle={{ marginTop: -10 }}
              iconColor={colors.mainFontColour}
              placeholderTextColor={colors.mainFontColour} />
          </Col>

          <Col style={padding.none}>
            <Pressable
              key={'filterbtn'}
              style={({ pressed }) => [
                styles.filterBtn,
                { opacity: pressed ? 0.5 : 1.0 }
              ]}
              onPress={() => viewFilter()}>
              <Text style={textStyles.button}>Filters</Text>
            </Pressable>
          </Col>
        </Row>
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