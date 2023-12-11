import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import styles from '../styles/styles';
import { colors, fonts, textStyles } from '../styles/style-constants';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL, FAVOURITE_DRINKS_KEY } from '../reusables/Constants';

const Recipe = ({ navigation, route }) => {
    const [recipeData, setRecipeData] = useState([]);
    // Iteration of favourited drinks
    const [favourites, setFavourites] = useState([])

    useEffect(() => {
        getJson()
    }, [route])

    async function getJson() {
        if (route.params.drinkId) {
            try {
                const response = await fetch(URL + 'lookup.php?i=' + route.params.drinkId)
                if (response.ok) {
                    const json = await response.json()
                    const data = json.drinks
                    setRecipeData(data)
                } else {
                    alert('Error retrieving recipes!');
                }
            } catch (err) {
                alert(err);
            }
        }
        else {
            try {
                const response = await fetch(URL + route.params.search)
                if (response.ok) {
                    const json = await response.json()
                    const data = json.drinks
                    setRecipeData(data)
                } else {
                    alert('Error retrieving recipes!');
                }
            } catch (err) {
                alert(err);
            }
        }
    }

    useEffect(() => {
        const unsubsribe = navigation.addListener('focus', () => {
            getFavouriteData()
        })
        return unsubsribe
    }, [navigation])

    const getFavouriteData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(FAVOURITE_DRINKS_KEY)
            if (jsonValue !== null) {
                let tmp = JSON.parse(jsonValue)
                setFavourites(tmp)
            }
        }
        catch (e) {
            console.log('Read error: ' + e)
        }
    }

    const isFavourited = favourites.some(fav => fav.drinkId === route.params.drinkId)

    const toggleHeart = async () => {
        try {
            if (isFavourited) {
                const newFavourites = favourites.filter((fav) => fav.drinkId !== recipeData[0].idDrink)
                await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavourites))
                setFavourites(newFavourites)
                alert('Drink removed from favourites')
            } else {
                const newKey = favourites.length + 1
                const drinkInfo = {
                    key: newKey,
                    drinkId: recipeData[0].idDrink,
                }
                const newFavourites = [...favourites, drinkInfo]
                await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavourites))
                setFavourites(newFavourites)
                alert('Favourite saved')
            }
        } catch (error) {
            console.log('Error saving favourite: ' + error)
            setFavourites((prevFavourites) =>
                prevFavourites.filter((fav) => fav.drinkId !== recipeData[0].idDrink))
        }

        console.log(favourites.length)
    }

    const drinkInfo = recipeData.map((data, id) => {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = data[`strIngredient${i}`];
            const measure = data[`strMeasure${i}`];

            if (ingredient && measure) {
                ingredients.push({ measure, ingredient });
            } else if (ingredient) {
                ingredients.push({ measure: '-', ingredient });
            }
        }

        return (
            <View key={id}>
                <View style={{ marginTop: 20, justifyContent: 'center', gap: 10 }}>
                    {ingredients.length > 0 ? (
                        ingredients.map((item, index) => (

                            <View key={index} style={styles.ingredientList}>
                                <View style={styles.listItem}>
                                    <Text style={styles.measure}>{item.measure}</Text>
                                    <Text style={styles.ingredient}>{item.ingredient}</Text>
                                </View>

                                <BouncyCheckbox
                                    size={22}
                                    fillColor="gray"
                                    unfillColor="#FFFFFF"
                                    iconStyle={{ borderColor: "gray" }}
                                    innerIconStyle={{ borderWidth: 1 }} />
                            </View>
                        ))
                    ) : (
                        <Text>No ingredients available</Text>
                    )}
                </View>
            </View>
        );
    });

    const drinkInstructions = recipeData.map((data, id) => {
        route.params.image = data.strDrinkThumb
        route.params.drinkName = data.strDrink
        route.params.category = data.strCategory
        return (
            <View key={id}>
                <View style={styles.prepList}>
                    {data.strInstructions ? (
                        data.strInstructions.split('.').map((instruction, index) => {
                            const trimmedInstruction = instruction.trim();
                            if (trimmedInstruction) {
                                return (
                                    <View key={index} style={styles.prepItem}>
                                        <View>
                                            <Text style={styles.step}>{`Step #${index + 1}`}</Text>
                                            <Text style={styles.prep}>{trimmedInstruction}</Text>
                                        </View>

                                        <BouncyCheckbox
                                            size={22}
                                            fillColor={colors.mainFontColour}
                                            unfillColor="#FFFFFF"
                                            iconStyle={{ borderColor: "gray" }}
                                            innerIconStyle={{ borderWidth: 1 }} />
                                    </View>
                                );
                            }
                            return null; // doesnt show empty instruction block
                        })
                    ) : (
                        <Text>No preparation instructions available</Text>
                    )}
                </View>
            </View>
        );
    });

    const categoryColors = {
        'Coffee / Tea': colors.brown,
        'Other / Unknown': '#999',
        'Ordinary Drink': colors.purple,
        'Cocktail': colors.purple,
        'Shot': colors.purple,
        'Homemade Liqueur': colors.purple,
        'Punch / Party Drink': colors.purple,
        'Beer': colors.purple,
        'Shake': colors.green,
        'Cocoa': colors.green,
        'Soft Drink': colors.yellow
    };

    return (
        <ScrollView>
            <View style={styles.recipeContainer} >
                <StatusBar hidden={true} />

                <ImageBackground
                    source={{ uri: route.params.image }}
                    resizeMode="cover"
                    opacity={0.5}
                    blurRadius={30}
                    style={{ paddingVertical: 30 }}>

                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.navigate(route.params.navigator, { screen: route.params.screen })}>
                            <Icon name="chevron-left" size={30} color={colors.mainFontColour} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleHeart}>
                            <Icon name={isFavourited ? 'heart' : 'heart-outline'} size={35} color="#ff6161" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.drinkInfo}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.drinkName}>{route.params.drinkName}</Text>
                            <Text style={styles.drinkCategory}>{route.params.category}</Text>
                        </View>
                        <View>
                            <Image style={{ width: 200, height: 200 }} source={{ uri: route.params.image }} />
                        </View>
                    </View>
                </ImageBackground>

                <View backgroundColor={categoryColors[route.params.category]} paddingVertical={20}>
                    <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Ingredients</Text>

                    <View>
                        {drinkInfo}
                    </View>

                    <View marginTop={30}>
                        <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Preparation</Text>
                        {drinkInstructions}
                    </View>

                    <View style={{ marginTop: 30, marginHorizontal: 20 }}>
                        <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Notes</Text>
                        <Pressable style={styles.noteBtn}>
                            <Text style={[textStyles.H1Upper, { color: colors.white, fontFamily: fonts.text, alignSelf: 'center' }]}>Add notes</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Recipe;