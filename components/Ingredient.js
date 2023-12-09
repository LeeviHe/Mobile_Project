import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, Image, Pressable, FlatList } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import styles from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts } from '../styles/style-constants';
import { Col, Row } from 'react-native-flex-grid';
import { getJsonIngredients, getJsonDrinks } from '../reusables/Functions';
import { URL } from '../reusables/Constants';

const Ingredient = ({ navigation, route }) => {
  const [selectStar, setSelectStar] = useState(false);
  const [ingredientData, setIngredientData] = useState([]);
  const [ingredientDrinks, setIngredientDrinks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleItems, setVisibleItems] = useState(9);

  const toggleStar = () => {
    setSelectStar(!selectStar);
  };

  useEffect(() => {
    getJsonIngredients(URL, 'lookup.php?iid=' + route.params.ingrId, setIngredientData);
    getJsonDrinks(URL, 'filter.php?i=' + route.params.ingrName, setIngredientDrinks);
  }, [route]);

  const renderDrinkItem = ({ item }) => (
    <Col key={item.idDrink}>
      <TouchableOpacity>
        <Image style={{ width: 100, height: 100 }} source={{ uri: item.strDrinkThumb }} />
        <Text>
          {item.strDrink.length > 12 ? item.strDrink.substring(0, 12) + '..' : item.strDrink}
        </Text>
      </TouchableOpacity>
    </Col>
  );

  const renderRow = ({ item }) => {
    return (
      <FlatList
        data={item}
        keyExtractor={(drink) => drink.idDrink}
        renderItem={({ item: drink }) => renderDrinkItem({ item: drink })}
        horizontal
        contentContainerStyle={{ justifyContent: 'space-around' }}
      />
    );
  };

  const renderRows = () => {
    const drinksToRender = showDropdown
      ? ingredientDrinks.slice(3, visibleItems)
      : ingredientDrinks.slice(0, 6);

    const rows = [];
    for (let i = 0; i < drinksToRender.length; i += 3) {
      const rowItems = drinksToRender.slice(i, i + 3);
      rows.push(<React.Fragment key={i}>{renderRow({ item: rowItems })}</React.Fragment>);
    }
    return rows;
  };

  const toggleMoreDrinks = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <ScrollView>
      <View style={styles.recipeContainer}>
        <StatusBar hidden={true} />

        <ImageBackground
          source={{ uri: route.params.ingrImg }}
          resizeMode="cover"
          opacity={0.5}
          blurRadius={20}
          style={{ paddingVertical: 30 }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Ingredients')}>
              <Icon name="chevron-left" size={30} color={colors.mainFontColour} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleStar}>
              <Icon name={selectStar ? 'star' : 'star-outline'} size={40} color="#e7c500" />
            </TouchableOpacity>
          </View>
          <View>
            {ingredientData.map((data, id) => (
              <View key={id} style={styles.drinkInfo}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.drinkName}>{data.strIngredient}</Text>
                  <Text style={styles.drinkCategory}>{data.strType}</Text>
                </View>
                <View>
                  <Image
                    style={{ width: 200, height: 200 }}
                    source={{ uri: 'https://www.thecocktaildb.com/images/ingredients/' + data.strType + '.png' }}
                  />
                </View>
              </View>
            ))}
          </View>
        </ImageBackground>

        <View style={{ marginVertical: 10 }}>
          <View style={{ marginHorizontal: 10 }}>{renderRows()}</View>
        </View>

        <View>
          <Pressable onPress={toggleMoreDrinks} style={styles.seeAllBtn}>
            <Text style={{ color: colors.white, fontSize: 16, fontFamily: fonts.header }}>
              See All
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Ingredient;