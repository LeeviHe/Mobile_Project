import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { Col, Row } from 'react-native-flex-grid';
import styles from '../styles/styles';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { usePockettini } from './PockettiniContext';
import * as ImagePicker from 'expo-image-picker';

export default function MakeAPockettini({ navigation, route }) {
  const { index, pockettini } = route.params ?? {}
  const { addPockettini, removePockettini, updatePockettini } = usePockettini()
  const [image, setImage] = useState(pockettini?.drinkImg || null);

  const [drinkName, setDrinkName] = useState(pockettini?.drinkName || '')
  const [category, setCategory] = useState(pockettini?.drinkCategory || '')
  const [number, setNumber] = useState(pockettini?.number || '')
  const [amount, setAmount] = useState(pockettini?.amount || '')
  const [ingredients, setIngredients] = useState(pockettini?.drinkIngredients || [{ number: 0, amount: '-', name: '' }])
  const [preparations, setPreparations] = useState(pockettini?.steps || [])
  const [notes, setNotes] = useState(pockettini?.notes || [])

  const [modalType, setModalType] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isOverlayVisible, setOverlayVisible] = useState(false)

  const isEmpty = !drinkName ||
    !category ||
    ingredients.length === 0 ||
    ingredients[0].number === 0 ||
    ingredients[0].amount === '-' ||
    !ingredients[0].name ||
    preparations.length === 0;

  const [currentIngredientIndex, setCurrentIngredientIndex] = useState(null);

  const togglePicker = (type, index = null) => {
    const isVisible = isModalVisible;
    setOverlayVisible(!isVisible);
    setModalVisible(!isVisible);
    setModalType(type || '');

    setCurrentIngredientIndex(index)
  };

  const categories = [
    'Coffee / Tea',
    'Other / Unknown',
    'Ordinary Drink',
    'Cocktail',
    'Shot',
    'Homemade Liqueur',
    'Punch / Party Drink',
    'Beer',
    'Shake',
    'Cocoa',
    'Soft Drink'
  ];

  const generateNumbers = (start, end, step) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  };

  const numbers = generateNumbers(0, 5, 0.25)

  const amounts = [
    '-',
    'ml',
    'cl',
    'oz',
    'part',
    'dash',
    'dashes',
    'tsp',
    'piece',
    'shot',
    'shots',
    'part',
    'parts',
    'splash',
    'some',
    'pint'
  ]

  const addIngredient = () => {
    const newIngredient = { name: '', number: 0, amount: '-' };
    setIngredients([...ingredients, newIngredient])
  };

  const updateNumber = (index, newNumber) => {
    const newIngredients = [...ingredients];
    newIngredients[index].number = newNumber;
    setIngredients(newIngredients);
  };

  const updateAmount = (index, newAmount) => {
    const newIngredients = [...ingredients];
    newIngredients[index].amount = newAmount;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const addPreparation = () => {
    setPreparations([...preparations, '']);
  };

  const removePreparation = (index) => {
    const newPreparations = [...preparations]
    newPreparations.splice(index, 1)
    setPreparations(newPreparations)
  };

  const updatePreparation = (index, text) => {
    const newPreparations = [...preparations];
    newPreparations[index] = text;
    setPreparations(newPreparations);
  };

  const addNotes = () => {
    setNotes([...notes, '']);
  };

  const removeNotes = (index) => {
    const newNotes = [...notes]
    newNotes.splice(index, 1)
    setNotes(newNotes)
  };

  const updateNote = (index, text) => {
    const newNotes = [...notes];
    newNotes[index] = text;
    setNotes(newNotes);
  }

  const handleSave = () => {
    const newPockettini = {
      drinkName: drinkName,
      drinkImg: image,
      drinkCategory: category,
      number: number,
      amount: amount,
      drinkIngredients: ingredients,
      steps: preparations,
      notes: notes
    }

    if (index !== undefined) {
      updatePockettini(index, newPockettini)
    } else {
      addPockettini(newPockettini)
    }

    navigation.navigate('MyPockettinis')
  }

  const deletePockettini = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Pockettini?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            removePockettini(index)
            navigation.navigate('MyPockettinis')
          }
        }
      ]
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
      style={{ flex: 1, backgroundColor: 'transparent' }}>

      <ScrollView>
        <View style={[styles.container, { marginBottom: 30 }]}>
          <StatusBar hidden={true} />

          <View>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.navigate('MyPockettinis')}>
                <Icon name="chevron-left" size={30} color={colors.mainFontColour} />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => deletePockettini(index)}>

                  <Icon
                    name="trash-can-outline"
                    size={30}
                    color='#ff6161'
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSave}
                  disabled={isEmpty}
                  style={[styles.saveBtn,
                  { backgroundColor: isEmpty ? '#C0C0C0' : colors.mainFontColour }]}>

                  <Text style={{ color: colors.white, fontFamily: fonts.text }}>save</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>

          <View style={styles.drinkInfo}>
            <View style={{ alignItems: 'center', gap: 5 }}>
              <TextInput
                style={[styles.drinkName, { borderBottomWidth: 1, borderBottomColor: colors.mainFontColour }]}
                value={drinkName}
                placeholder='Drink name..'
                onChangeText={setDrinkName}
              />

              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => togglePicker('category')}>

                <Text style={styles.drinkCategory}>
                  {category ? category : 'category'}
                </Text>

                <Icon name='chevron-down' size={20} color={colors.mainFontColour} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={pickImage} style={styles.imgContainer}>
              {image ? (
                <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Icon name="image-multiple-outline" size={100} color={colors.mainFontColour} />
              )}
            </TouchableOpacity>

          </View>

          <View style={styles.partContainer}>
            <Text style={[textStyles.H1Upper, { marginBottom: 10 }]}>Ingredients</Text>

            <View>
              {ingredients.map((ingredient, index) => (
                <Row key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10, backgroundColor: 'white' }]}>
                  <Col style={styles.editAmount}>
                    <TouchableOpacity
                      onPress={() => togglePicker('numberAmount', index)}
                      style={styles.measureView}>

                      <Text style={styles.editMeasure}>
                        {ingredient.number}
                      </Text>

                      <View style={{ borderLeftWidth: 1, borderLeftColor: colors.mainFontColour }} />

                      <Text style={styles.editMeasure}>
                        {ingredient.amount}
                      </Text>
                    </TouchableOpacity>
                  </Col>

                  <Col style={styles.inputView}>
                    <TextInput
                      style={[styles.ingrName, { color: colors.mainFontColour }]}
                      value={ingredient.name}
                      placeholder='Ingredient name..'
                      onChangeText={(name) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].name = name;
                        setIngredients(newIngredients);
                      }}
                    />
                    {index !== 0 && (
                      <TouchableOpacity onPress={() => removeIngredient(index)}>
                        <Icon name='close-circle-outline' size={30} color='#ff6161' />
                      </TouchableOpacity>
                    )}
                  </Col>
                </Row>
              ))
              }
            </View>

            <View>
              <TouchableOpacity style={styles.noteBtn} onPress={addIngredient}>
                <Text style={[textStyles.H1Upper, styles.addBtn]}>Add Ingredients</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.partContainer, { marginTop: 50 }]}>
            <Text style={[textStyles.H1Upper, { marginBottom: 10 }]}>Preparation</Text>

            <View style={[styles.inputViewLarge, styles.shadow]}>
              <TextInput
                style={[styles.prepName, { color: colors.mainFontColour }]}
                value={preparations[0]}
                placeholder='Step 1..'
                onChangeText={(text) => updatePreparation(0, text)}
              />
            </View>

            <View>
              {preparations.slice(1).map((preparation, index) => (
                <View key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10, backgroundColor: 'white' }]}>
                  <View style={styles.inputViewLarge}>
                    <TextInput
                      style={[styles.prepName, { color: colors.mainFontColour }]}
                      value={preparation}
                      placeholder={`Step ${index + 2}..`}
                      onChangeText={(text) => updatePreparation(index + 1, text)} />

                    <TouchableOpacity onPress={() => removePreparation(index + 1)}>
                      <Icon name='close-circle-outline' size={30} color='#ff6161' />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.noteBtn} onPress={addPreparation}>
              <Text style={[textStyles.H1Upper, styles.addBtn]}>Add Preparations</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.partContainer, { marginTop: 50 }]}>
            <Text style={[textStyles.H1Upper, { marginBottom: 10 }]}>Notes</Text>

            <View>
              {notes.map((note, index) => (
                <View key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10, backgroundColor: 'white' }]}>
                  <View style={styles.inputViewLarge}>
                    <TextInput
                      style={[styles.prepName, { color: colors.mainFontColour }]}
                      value={note}
                      placeholder={'Write something here..'}
                      onChangeText={(text) => updateNote(index, text)}
                    />
                    <TouchableOpacity onPress={() => removeNotes(index)}>
                      <Icon name='close-circle-outline' size={30} color='#ff6161' />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.noteBtn} onPress={addNotes}>
              <Text style={[textStyles.H1Upper, styles.addBtn]}>Add Notes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {
          isOverlayVisible && isModalVisible && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#ffffffef'
            }}>

              <Modal
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                onRequestClose={togglePicker}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                  {isModalVisible && modalType === 'category' && (
                    <View style={{ width: '100%' }}>
                      <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}>
                        {categories.map((category, index) => (
                          <Picker.Item key={index} label={category} value={category} />
                        ))}
                      </Picker>
                    </View>
                  )}

                  {modalType === 'numberAmount' && (
                    <Row>
                      <Col>
                        <Picker
                          selectedValue={currentIngredientIndex === null ? number : ingredients[currentIngredientIndex]?.number}
                          onValueChange={(itemValue) => {
                            if (currentIngredientIndex === null) {
                              setNumber(itemValue);
                            } else {
                              updateNumber(currentIngredientIndex, itemValue);
                            }
                          }}>
                          {numbers.map((number, index) => (
                            <Picker.Item key={index} label={number.toString()} value={number} />
                          ))}
                        </Picker>
                      </Col>

                      <Col>
                        <Picker
                          selectedValue={currentIngredientIndex === null ? amount : ingredients[currentIngredientIndex]?.amount}
                          onValueChange={(itemValue) => {
                            if (currentIngredientIndex === null) {
                              setAmount(itemValue);
                            } else {
                              updateAmount(currentIngredientIndex, itemValue);
                            }
                          }}>
                          {amounts.map((amount, index) => (
                            <Picker.Item key={index} label={amount} value={amount} />
                          ))}
                        </Picker>
                      </Col>
                    </Row>
                  )}
                  <TouchableOpacity onPress={togglePicker}>
                    <Text>Done</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )
        }
      </ScrollView >
    </KeyboardAvoidingView>
  );
}
