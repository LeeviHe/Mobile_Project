import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { Col, Row } from 'react-native-flex-grid';
import styles from '../styles/styles';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { usePockettini } from './PockettiniContext';
import { launchImageLibrary } from 'react-native-image-picker';

export default function MakeAPockettini({ navigation, route }) {
  const { index, pockettini } = route.params ?? {}
  const { addPockettini, removePockettini } = usePockettini()
  const [selectedImage, setSelectedImage] = useState(null);

  const [drinkName, setDrinkName] = useState(pockettini?.drinkName || '')
  const [category, setCategory] = useState(pockettini?.drinkCategory || '')
  const [number, setNumber] = useState()
  const [amount, setAmount] = useState()
  const [ingrName, setIngrName] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [preparations, setPreparations] = useState([])
  const [notes, setNotes] = useState([])

  const [modalType, setModalType] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isOverlayVisible, setOverlayVisible] = useState(false)


  const isEmpty = !drinkName || !category || !ingrName || preparations.length === 0;

  const togglePicker = (type) => {
    const isVisible = isModalVisible;
    setOverlayVisible(!isVisible);
    setModalVisible(!isVisible);
    setModalType(type || '');
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

  const updateList = (type, action, value, index) => {
    let newList;
    switch (type) {
      case 'ingredients':
        newList = action === 'update' ?
          ingredients.map((item, i) => i === index ? { ...item, ...value } : item) :
          action === 'add' ?
            [...ingredients, { number: 0, amount: '-', name: '' }] :
            ingredients.filter((_, i) => i !== index);
        setIngredients(newList);
        break;
      case 'preparations':
        newList = action === 'update' ?
          preparations.map((item, i) => i === index ? value : item) :
          action === 'add' ?
            [...preparations, ''] :
            preparations.filter((_, i) => i !== index);
        setPreparations(newList);
        break;
      case 'notes':
        newList = action === 'update' ?
          notes.map((item, i) => i === index ? value : item) :
          action === 'add' ?
            [...notes, ''] :
            notes.filter((_, i) => i !== index);
        setNotes(newList);
        break;
    }
  };

  const handleSave = () => {
    const newPockettini = {
      drinkName: drinkName,
      drinkCategory: category,
      number: number,
      amount: amount,
      ingrName: ingrName,
      steps: preparations,
      notes
    }

    addPockettini(newPockettini)
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

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  /*const selectImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImg(source.uri);
      }
    });
  };*/


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
              <TouchableOpacity
                onPress={() => deletePockettini(index)}>

                <Icon
                  name="trash-can-outline"
                  size={30}
                  color='#ff6161'
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave}
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


          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ flex: 1 }}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity onPress={openImagePicker}>
            <Text>Pick an Image</Text>
          </TouchableOpacity>

          {/*<TouchableOpacity onPress={selectImage} style={styles.imgContainer}>
            {img ? (
              <Image source={{ uri: img }} style={{ width: 100, height: 100 }} />
            ) : (
              <Icon name="image-multiple-outline" size={100} color={colors.mainFontColour} />
            )}
            </TouchableOpacity>*/}


        </View>

        <View style={styles.partContainer}>
          <Text style={[textStyles.H1Upper, { marginBottom: 10 }]}>Ingredients</Text>

          <View>
            <Row style={{ borderRadius: 5 }}>
              <Col style={[styles.editAmount, styles.shadow]}>
                <TouchableOpacity
                  onPress={() => togglePicker('numberAmount')}
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
                  value={ingrName}
                  placeholder='Ingredient name..'
                  onChangeText={setIngrName}
                />
              </Col>
            </Row>
          </View>

          <View>
            {ingredients.map((ingredient, index) => (
              <Row key={index} style={[styles.shadow, { borderRadius: 5, marginBottom: 10 }]}>
                <Col style={styles.editAmount}>
                  <TouchableOpacity
                    onPress={() => togglePicker('numberAmount', index)}
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
                    onChangeText={(ingrName) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = ingrName;
                      setIngredients(newIngredients);
                    }}
                  />
                  <TouchableOpacity onPress={() => updateList('ingredients', 'remove', null, index)}>
                    <Icon name='close-circle-outline' size={30} color='#ff6161' />
                  </TouchableOpacity>
                </Col>
              </Row>
            ))
            }
          </View>

          <View>
            <TouchableOpacity style={styles.noteBtn} onPress={() => updateList('ingredients', 'add')}>
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
              onChangeText={(text) => updateList(0, text)}
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
                    onChangeText={(text) => updateList('preparations', 'update', text, index + 1)}
                  />
                  <TouchableOpacity onPress={() => updateList('preparations', 'remove', null, index + 1)}>
                    <Icon name='close-circle-outline' size={30} color='#ff6161' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.noteBtn} onPress={() => updateList('preparations', 'add')}>
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
                    onChangeText={(text) => updateList('notes', 'update', text, index)}
                  />
                  <TouchableOpacity onPress={() => updateList('notes', 'remove', null, index)}>
                    <Icon name='close-circle-outline' size={30} color='#ff6161' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>


          <TouchableOpacity style={styles.noteBtn} onPress={() => updateList('notes', 'add')}>
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
                <TouchableOpacity onPress={togglePicker}>
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
