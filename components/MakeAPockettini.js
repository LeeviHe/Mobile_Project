import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { Col, Row } from 'react-native-flex-grid';
import styles from '../styles/styles';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { LinearGradient } from 'expo-linear-gradient';

export default function MakeAPockettini({ navigation }) {

  const [text, setText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [drinkName, setDrinkName] = useState("");
  const [number, setNumber] = useState();
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState(null);
  const [modalType, setModalType] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [preparations, setPreparations] = useState([]);
  const [notes, setNotes] = useState([]);

  const openPicker = (type) => {
    setOverlayVisible(true)
    setModalVisible(true)
    setModalType(type)
  };

  const closePicker = () => {
    setOverlayVisible(false)
    setModalVisible(false)
    setModalType('')
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
    setIngredients([...ingredients, { number: 0, amount: '-', name: '' }]);
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
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <View>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('MyPockettinis')}>
              <Icon name="chevron-left" size={30} color={colors.mainFontColour} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity>
                <Icon name="trash-can-outline" size={30} color={'#ff6161'} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn}>
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
              onPress={() => openPicker('category')}>

              <Text style={styles.drinkCategory}>
                {category ? category : 'category'}
              </Text>

              <Icon name='chevron-down' size={20} color={colors.mainFontColour} />
            </TouchableOpacity>
          </View>

          {/**add img */}
          <TouchableOpacity style={styles.imgContainer}>
            <Icon name="image-multiple-outline" size={100} color={colors.mainFontColour} />
          </TouchableOpacity>
        </View>

        <View style={styles.partContainer}>
          <Text style={[textStyles.H1Upper, { marginBottom: 10 }]}>Ingredients</Text>

          <View>
            <Row style={{ borderRadius: 5 }}>
              <Col style={[styles.editAmount, styles.shadow]}>
                <TouchableOpacity
                  onPress={() => openPicker('numberAmount')}
                  style={styles.measureView}>

                  <Text style={styles.editMeasure}>
                    {number ? number : '0'}
                  </Text>
                  <View style={{ borderLeftWidth: 1, borderLeftColor: colors.mainFontColour }} />
                  <Text style={styles.editMeasure}>
                    {amount ? amount : '-'}
                  </Text>
                </TouchableOpacity>
              </Col>

              <Col style={[styles.inputView, styles.shadow]}>
                <TextInput
                  style={{ color: colors.mainFontColour }}
                  value={text}
                  placeholder='Ingredient name..'
                  onChangeText={setText}
                />
              </Col>
            </Row>
          </View>

          <View>
            {ingredients.map((ingredient, index) => (
              <Row key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10 }]}>
                <Col style={styles.editAmount}>
                  <TouchableOpacity
                    onPress={() => openPicker('numberAmount', index)}
                    style={styles.measureView}>

                    <Text style={styles.editMeasure}>
                      {number ? number : '0'}
                    </Text>

                    <View style={{ borderLeftWidth: 1, borderLeftColor: colors.mainFontColour }} />

                    <Text style={styles.editMeasure}>
                      {amount ? amount : '-'}
                    </Text>
                  </TouchableOpacity>
                </Col>

                <Col style={styles.inputView}>
                  <TextInput
                    style={{ color: colors.mainFontColour }}
                    value={ingredient.name}
                    placeholder='Ingredient name..'
                    onChangeText={(text) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = text;
                      setIngredients(newIngredients);
                    }}
                  />
                  <TouchableOpacity onPress={() => removeIngredient(index)}>
                    <Icon name='close-circle-outline' size={30} color='#ff6161' />
                  </TouchableOpacity>
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
              style={{ color: colors.mainFontColour }}
              value={preparations[0]}
              placeholder='Step 1..'
              onChangeText={(text) => updatePreparation(0, text)}
            />
          </View>

          <View>
            {preparations.slice(1).map((preparation, index) => (
              <View key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10 }]}>
                <View style={styles.inputViewLarge}>
                  <TextInput
                    style={{ color: colors.mainFontColour }}
                    value={preparation}
                    placeholder={`Step ${index + 2}..`}
                    onChangeText={(text) => updatePreparation(index + 1, text)}
                  />
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
              <View key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10 }]}>
                <View style={styles.inputViewLarge}>
                  <TextInput
                    style={{ color: colors.mainFontColour }}
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
              onRequestClose={closePicker}>

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
                        selectedValue={number}
                        onValueChange={(itemValue) => setNumber(itemValue)}>
                        {numbers.map((number, index) => (
                          <Picker.Item key={index} label={number.toString()} value={number} />
                        ))}
                      </Picker>
                    </Col>

                    <Col>
                      <Picker
                        selectedValue={amount}
                        onValueChange={(itemValue) => setAmount(itemValue)}>
                        {amounts.map((amount, index) => (
                          <Picker.Item key={index} label={amount} value={amount} />
                        ))}
                      </Picker>
                    </Col>
                  </Row>
                )}
                <TouchableOpacity onPress={closePicker}>
                  <Text>Done</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )
      }
    </ScrollView >
  );
}
