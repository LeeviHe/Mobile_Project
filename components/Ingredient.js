import { Text, View, TouchableOpacity, ImageBackground, Image, Pressable } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import styles from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { useState, useEffect } from 'react';
import { Col, Row } from 'react-native-flex-grid';
import { getJsonIngredients } from '../reusables/Functions';
import { getJsonDrinks } from '../reusables/Functions';
import { FlatList } from 'react-native';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

export default function Ingredient({ navigation, route }) {
  const [selectStar, setSelectStar] = useState(false)
  const [ingredientData, setIngredientData] = useState([]);
  const [ingredientDrinks, setIngredientDrinks] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleStar = () => {
    setSelectStar(!selectStar);
  };

  useEffect(() => {
    getJsonIngredients(URL, 'lookup.php?iid=' + route.params.ingrId, setIngredientData)
    getJsonDrinks(URL, 'filter.php?i=' + route.params.ingrName, setIngredientDrinks)
  }, [route])

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

  const toggleMoreDrinks = () => {
    setShowDropdown(!showDropdown);
  };

  const RenderPossibleDrinks = ({ingredientDrinks, showDropdown, colors, fonts}) => {
    const [visibleItems, setVisibleItems] = useState(9); // Number of initially visible items

    const renderItem = ({ item, index }) => (

      <Col>

        <TouchableOpacity>
          <Image style={{ width: 100, height: 100 }} source={{ uri: item.strDrinkThumb }} />
          <Text>{item.strDrink}</Text>
        </TouchableOpacity>

      </Col>
      
    );

    return (
      <View>
        <Row style={{ marginHorizontal: 10, flexDirection: 'row'}}>
          
            <FlatList
            data={ingredientDrinks.slice(0, 3)} // Show only first three
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            />
          
        </Row>
        {showDropdown && (
          <View style={styles.dropdownList}>
            <FlatList
              data={ingredientDrinks.slice(3, visibleItems)} // Show only from fourth to visibleItems set above
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              onEndReached={() => {
                // Loads more items when the end of the list is reached
                setVisibleItems((prev) => prev + 6); // Increase the number of visible items here
              }}
              onEndReachedThreshold={0.3} // Trigger onEndReached when 30%? of the list is scrolled
            />
          </View>
        )}
      </View>
    );
  };

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
              <Icon name={selectStar ? 'star' : 'star-outline'} size={40} color="#e7c500" />
            </TouchableOpacity>
          </View>

          <View>
            {test}
          </View>
        </ImageBackground>
        <View>
          <Pressable onPress={toggleMoreDrinks} style={styles.noteBtn}>
            <Text>See All (vaihda tyyli)</Text>
          </Pressable>
        </View>
        <RenderPossibleDrinks
        ingredientDrinks={ingredientDrinks}  
        showDropdown={showDropdown}  
        colors={colors}  
        fonts={fonts} />
      </View>
    </ScrollView>
  );
}