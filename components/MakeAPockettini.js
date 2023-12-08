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
  const [number, setNumber] = useState();
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState(null);
  const [modalType, setModalType] = useState('');

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
              value={text}
              placeholder='Drink name..'
              onChangeText={setText}
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

        <View style={{ marginTop: 20, marginHorizontal: 20, gap: 10 }}>
          <Text style={[textStyles.H1Upper, { marginBottom: 10 }]}>Ingredients</Text>

          <Row style={[styles.shadow, { borderRadius: 5 }]}>
            <Col style={styles.editAmount}>
              <TouchableOpacity
                onPress={() => openPicker('numberAmount')}
                style={styles.measureView}>

                <Text style={styles.editMeasure}>
                  {number ? number : '0'}
                </Text>
                <View style={{ borderLeftWidth: 1, borderLeftColor: colors.mainFontColour }} />
                <Text style={styles.editMeasure}>
                  {amount ? amount : 'ml'}
                </Text>

              </TouchableOpacity>
            </Col>

            <Col style={styles.inputView}>
              <TextInput
                style={{ color: colors.mainFontColour }}
                value={text}
                placeholder='Ingredient name..'
                onChangeText={setText}
              />

              <View>
                <Icon name='close-circle-outline' size={30} color='#ff6161' />
              </View>
            </Col>
          </Row>

          <View>
            <TouchableOpacity style={styles.noteBtn}>
              <Text style={[textStyles.H1Upper, styles.addBtn]}>Add Ingredients</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View paddingVertical={20}>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Preparation</Text>
            <Pressable style={styles.noteBtn}>
              <Text style={[textStyles.H1Upper, { color: colors.white, fontFamily: fonts.text, alignSelf: 'center' }]}>Add preparations</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Notes</Text>
            <Pressable style={styles.noteBtn}>
              <Text style={[textStyles.H1Upper, { color: colors.white, fontFamily: fonts.text, alignSelf: 'center' }]}>Add notes</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {isOverlayVisible && isModalVisible && (
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
      )}
    </ScrollView >
  );
}
