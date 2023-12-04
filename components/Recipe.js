import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, Pressable } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import styles from '../styles/styles';
import { colors, fonts, textStyles } from '../styles/style-constants';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

const Recipe = ({ navigation, route }) => {
    const [checked, setChecked] = useState(false);
    const [isHeartSelected, setHeartSelected] = useState(false);
    const [recipeData, setRecipeData] = useState([]);

    const toggleHeart = () => {
        setHeartSelected(!isHeartSelected);
    };

    useEffect(() => {
        getJson()
    }, [route.params.drinkId])

    const drinkInfo = recipeData.map((data, id) => {
            return (
                <View key={id}>
                    
                </View>
            )
        })

    async function getJson () {
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
                        <TouchableOpacity onPress={() => navigation.navigate('Cocktails')}>
                            <Icon name="arrow-left" size={30} color={colors.mainFontColour} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleHeart}>
                            <Icon name={isHeartSelected ? 'heart' : 'heart-outline'} size={35} color="#ff6161" />
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

                <View>
                    <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Ingredients</Text>

                    <View width={200} marginTop={5} alignItems='center' borderWidth={1}>
                        <Text style={{ color: colors.smallFontColour }}>servings</Text>
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <Text>1</Text>
                            <Text>2</Text>
                            <Text>3</Text>
                            <Text>4</Text>
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 20, justifyContent: 'center' }}>
                        <View style={styles.ingredientList}>
                            <View style={styles.listItem}>
                                <Text style={{ fontWeight: 800, fontFamily: fonts.boldText }}>60-90 ml</Text>
                                <Text style={{ fontFamily: fonts.text }}>Light Rum</Text>
                            </View>

                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => setChecked(!checked)}
                                style={styles.checkbox} />
                        </View>
                    </View>

                    <View style={{ marginTop: 25 }}>
                        <Text>Preparation</Text>

                        <View style={{ borderWidth: 1, borderRadius: 5, alignItems: 'center', flexDirection: 'row' }}>
                            <View>
                                <Text>Step #1</Text>
                                <Text>Muddle mint leaves with sugar and lime juice</Text>
                            </View>

                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => setChecked(!checked)}
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 25 }}>
                        <Text>Notes</Text>
                        <Pressable style={{ borderWidth: 1, alignItems: 'center' }}>
                            <Text>Add note</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Recipe;
