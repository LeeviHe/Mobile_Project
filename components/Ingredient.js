import { Text, View, TouchableOpacity, ScrollView, ImageBackground, Image, Pressable } from 'react-native';
import styles from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { useState, useEffect } from 'react';
import { Col, Row } from 'react-native-flex-grid';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

export default function Ingredient({ navigation, route }) {
  const [selectStar, setSelectStar] = useState(false)
  const [ingredientData, setIngredientData] = useState([]);

  const toggleStar = () => {
    setSelectStar(!selectStar);
  };

  useEffect(() => {
    getJson()
  }, [route])

  async function getJson() {
    if (route.params.ingrId) {
      try {
        const response = await fetch(URL + 'lookup.php?iid=' + route.params.ingrId)
        if (response.ok) {
          const json = await response.json()
          const data = json.ingredients
          setIngredientData(data)
        } else {
          alert('Error retrieving ingredients!');
        }
      } catch (err) {
        alert(err);
      }
    }
  }

  const test = ingredientData.map((data, id) => (

    <View key={id} style={styles.drinkInfo}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.drinkName}>{data.strIngredient}</Text>
        <Text style={styles.drinkCategory}>{data.strType}</Text>
      </View>
      <View>
        <Image style={{ width: 200, height: 200 }} source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png' }} />
      </View>
    </View>
  ));

  return (
    <ScrollView>
      <View style={styles.recipeContainer} >
        <StatusBar hidden={true} />

        <ImageBackground
          source={{ uri: route.params.ingrImg }}
          resizeMode="cover"
          opacity={0.5}
          blurRadius={20}
          style={{ paddingVertical: 30 }}>

          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Ingredients')}>
              <Icon name="arrow-left" size={30} color={colors.mainFontColour} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleStar}>
              <Icon name={selectStar ? 'star' : 'star-outline'} size={35} color="#e7c500" />
            </TouchableOpacity>
          </View>

          <View>
            {test}
          </View>
        </ImageBackground>

        <View marginTop={20}>
          <Text style={[textStyles.H1Upper, { alignSelf: 'center' }]}>Drinks made with tequila</Text>

          <View>
            <Row style={{ marginHorizontal: 10 }}>
              <Col>
                <Image style={{ width: 100, height: 100 }} source={require('../assets/images/CoffeeTea-category.png')} />
                <Text>Bloody Mary</Text>
              </Col>

              <Col>
                <Image style={{ width: 100, height: 100 }} source={require('../assets/images/CoffeeTea-category.png')} />
                <Text>Bloody Mary</Text>
              </Col>

              <Col>
                <Image style={{ width: 100, height: 100 }} source={require('../assets/images/CoffeeTea-category.png')} />
                <Text>Bloody Mary</Text>
              </Col>
            </Row>
          </View>

          <View>
            <Pressable style={styles.noteBtn}>
              <Text>See All (vaihda tyyli)</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}