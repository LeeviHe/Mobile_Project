import { Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import { Row, Col } from "react-native-flex-grid";
import { Searchbar } from 'react-native-paper';

export default function MyPockettinis() {
  const [check, setCheck] = useState(false);
  const [cocktailView, setCocktailView] = useState(false);
  const [ingredientView, setIngredientView] = useState(true);

  const viewCocktails = () => {
    setCocktailView(true);
    setIngredientView(false);
  };

  const viewIngredients = () => {
    setCocktailView(false);
    setIngredientView(true);
  };

  const toggleCheck = () => {
    setCheck(!check);
  };

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Ingredients</Text>

      <View style={{ marginBottom: 20 }}>
        <Row>
          <Col style={ingredientView ? styles.topIngrColActive : styles.topIngrCol}>
            <TouchableOpacity
              onPress={viewIngredients}
              style={{ flexDirection: 'row', gap: 10 }}>

              <Text fontFamily={fonts.header}
                style={{
                  fontSize: 16,
                  color: ingredientView ? colors.mainFontColour : '#ccc',
                  fontFamily: fonts.header
                }}>Ingredients
              </Text>

              <View style={styles.topIngrNbr}
                backgroundColor={ingredientView ? '#333' : '#ddd'}>
                <Text style={{ color: colors.white }}>0</Text>
              </View>

            </TouchableOpacity>
          </Col>

          <Col style={cocktailView ? styles.topIngrColActive : styles.topIngrCol}>
            <TouchableOpacity
              onPress={viewCocktails}
              style={{ flexDirection: 'row', gap: 10 }}>

              <Text fontFamily={fonts.header} style={{
                fontSize: 16,
                color: cocktailView ? colors.mainFontColour : '#ccc',
                fontFamily: fonts.header
              }}>Cocktails</Text>

              <View style={styles.topIngrNbr}
                backgroundColor={cocktailView ? '#333' : '#ddd'}>
                <Text style={{ color: colors.white }}>0</Text>
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
      </View>

      <View style={{ marginBottom: 50 }}>
        <Searchbar
          placeholder="Search"
          style={styles.ingrSearch}
          inputStyle={{ marginTop: -10 }}
          iconColor={colors.mainFontColour}
          placeholderTextColor={colors.mainFontColour}
        />
      </View>

      {ingredientView && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Name of type</Text>

          <Row style={styles.myRow}>
            <Col style={styles.myCol}>
              <Pressable style={styles.myBtn} onPress={toggleCheck}>
                <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
              </Pressable>

              <View style={{ alignItems: 'center', gap: 10 }}>
                <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                <Text>Name</Text>
              </View>
            </Col>

            <Col style={styles.myCol}>
              <Pressable style={styles.myBtn} onPress={toggleCheck}>
                <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
              </Pressable>

              <View style={{ alignItems: 'center', gap: 10 }}>
                <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                <Text>Name</Text>
              </View>
            </Col>

            <Col style={styles.myCol}>
              <Pressable style={styles.myBtn}>
                <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
              </Pressable>

              <View style={{ alignItems: 'center', gap: 10 }}>
                <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                <Text>Name</Text>
              </View>
            </Col>
          </Row>

          <Row style={styles.myRow}>
            <Col style={styles.myCol}>
              <Pressable style={styles.myBtn} onPress={toggleCheck}>
                <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
              </Pressable>

              <View style={{ alignItems: 'center', gap: 10 }}>
                <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                <Text>Name</Text>
              </View>
            </Col>

            <Col style={styles.myCol}>
              <Pressable style={styles.myBtn} onPress={toggleCheck}>
                <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
              </Pressable>

              <View style={{ alignItems: 'center', gap: 10 }}>
                <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                <Text>Name</Text>
              </View>
            </Col>

            <Col style={styles.myCol}>
              <Pressable style={styles.myBtn}>
                <Icon name='check' size={18} color={check ? colors.mainFontColour : 'transparent'} />
              </Pressable>

              <View style={{ alignItems: 'center', gap: 10 }}>
                <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
                <Text>Name</Text>
              </View>
            </Col>
          </Row>
        </View>
      )}

      {cocktailView && (
        <View style={{ marginHorizontal: 10 }}>
          <Text style={{ fontFamily: fonts.header, fontSize: 18, marginBottom: 10 }}>Possible cocktails</Text>

          <View style={styles.drinkContainer}>
            <TouchableOpacity
              style={[styles.cocktail, { backgroundColor: 'lightblue' }]}>

              <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <Image source={require('../assets/images/CoffeeTea-category.png')} style={styles.drinkImg} />

                <View style={styles.cocktailInfo}>
                  <Text style={styles.drinkText}>drink name</Text>
                  <Text style={styles.drinkText}>category</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}