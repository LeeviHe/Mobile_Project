import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import styles from '../styles/styles';
import { colors, fonts, textStyles, modalStyle } from '../styles/style-constants';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { URL } from '../reusables/Constants';
import { useFavourites } from './FavouritesContext';
import { usePockettini } from './PockettiniContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Recipe = ({ navigation, route }) => {
    const [recipeData, setRecipeData] = useState([]);
    const [isAPIbusy, setAPIBusy] = useState(false)
    const [modal, setModal] = useState(false)
    const [modalText, setModalText] = useState('')
    const [linkText, setLinkText] = useState('')
    const [drinkId, setDrinkId] = useState('')
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const { updatePockettini } = usePockettini()

    const { favouritesData, setFavouritesData, addFavourite, removeFavourite } = useFavourites()

    const navToFav = () => {
        navigation.navigate('MoreNavigator', {
            screen: 'Favourites',
        });
    };

    useEffect(() => {
        getJson()
    }, [route])

    async function getJson() {
        if (route.params.drinkId) {
            setAPIBusy(true)
            try {
                const response = await fetch(URL + 'lookup.php?i=' + route.params.drinkId)
                if (response.ok) {
                    const json = await response.json()
                    const data = json.drinks
                    setRecipeData(data)
                    setDrinkId(route.params.drinkId)
                } else {
                    alert('Error retrieving recipes!');
                }
            } catch (err) {
                alert(err);
            }
            setAPIBusy(false)
        }
        else {
            setAPIBusy(true)
            try {
                const response = await fetch(URL + route.params.search)
                if (response.ok) {
                    const json = await response.json()
                    const data = json.drinks
                    data.map((data, id) => {
                        setDrinkId(data.idDrink)
                    })
                    setRecipeData(data)
                } else {
                    alert('Error retrieving recipes!');
                }
            } catch (err) {
                alert(err);
            }
            setAPIBusy(false)
        }
    }

    const isFavourited = favouritesData.some(fav => fav.idDrink === drinkId)

    const toggleHeart = async () => {
        try {
            if (isFavourited) {
                removeFavourite(drinkId)
                setModal(true)
                setModalText('Removed from favourites')
                setLinkText('')
                setTimeout(() => {
                    setModal(false)
                }, 1000);
            } else {
                const newKey = favouritesData.length + 1
                const drinkInfo = {
                    key: newKey,
                    idDrink: recipeData[0].idDrink,
                    strDrink: recipeData[0].strDrink,
                    strDrinkThumb: recipeData[0].strDrinkThumb,
                    strCategory: recipeData[0].strCategory
                }
                addFavourite(drinkInfo)
                setModal(true)
                setModalText('Added to ')
                setLinkText('favourites')
                setTimeout(() => {
                    setModal(false)
                }, 2000);
            }
        } catch (error) {
            console.log('Error saving favourite: ' + error)
            setFavouritesData((prevFavourites) =>
                prevFavourites.filter((fav) => fav.drinkId !== recipeData[0].idDrink))
        }
    }

    const handleAddNote = async () => {
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        await AsyncStorage.setItem(`notes_${drinkId}`, JSON.stringify(updatedNotes));
        setNewNote('');
    };

    const removeNotes = async (index) => {
        const newNotes = [...notes]
        newNotes.splice(index, 1)
        setNotes(newNotes)
        await AsyncStorage.setItem(`notes_${drinkId}`, JSON.stringify(newNotes));
    };

    useEffect(() => {
        const loadNotes = async () => {
            const savedNotes = await AsyncStorage.getItem(`notes_${drinkId}`);
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        };
        loadNotes();
    }, [drinkId]);

    const handleNoteChange = (index, text) => {
        const updatedNotes = [...notes];
        updatedNotes[index] = text;
        setNotes(updatedNotes);
    };

    const notesList = notes.map((note, index) => (

        <View style={styles.inputViewLarge}>
            <TextInput
                style={[styles.note, { height: 30 }]}
                value={note}
                placeholder='Write something..'
                onChangeText={(text) => handleNoteChange(index, text)}
                onBlur={() => AsyncStorage.setItem(`notes_${drinkId}`, JSON.stringify(notes))}
            />

            <TouchableOpacity onPress={() => removeNotes(index)}>
                <Icon name='trash-can-outline' size={30} color={colors.mainFontColour} />
            </TouchableOpacity>
        </View>

    ));
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
            style={{ flex: 1, backgroundColor: 'transparent' }}>

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
                            {!isAPIbusy ? <>{drinkInstructions}</> : (<ActivityIndicator size={250} color={"#c0c0c0"} />)}
                        </View>

                        <View style={{ gap: 10, marginTop: 30, marginHorizontal: 20 }}>
                            <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Notes</Text>

                            {notesList}

                            <TouchableOpacity style={styles.noteBtn} onPress={handleAddNote}>
                                <Text style={[textStyles.H1Upper, { color: colors.white, fontFamily: fonts.text, alignSelf: 'center' }]}>Add notes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
        </KeyboardAvoidingView>
    );
};

export default Recipe;