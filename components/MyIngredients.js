import { Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';
import { Row, Col } from "react-native-flex-grid";
import { Searchbar } from 'react-native-paper';


export default function MyPockettinis() {

  const [check, setCheck] = useState(false)

  const toggleCheck = () => {
    setCheck(!check);
  };

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Ingredients</Text>

      <View style={{ marginBottom: 20 }}>
        <Row>
          <Col style={styles.topIngrColActive}>
            <Text fontFamily={fonts.header} style={{ fontSize: 18 }}>Ingredients</Text>

            <View style={styles.topIngrActiveNbr}>
              <Text style={{ color: colors.white }}>0</Text>
            </View>
          </Col>

          <Col style={styles.topIngrCol}>
            <Text fontFamily={fonts.header} style={{ fontSize: 18, color: '#ccc' }}>Cocktails</Text>

            <View style={styles.topIngrNbr}>
              <Text style={{ color: colors.white }}>0</Text>
            </View>
          </Col>
        </Row>
      </View>

      <View style={{ marginBottom: 50 }}>
        <Searchbar
          placeholder="Search"
          //onChangeText={(value) => { onChangeSearch(value) }}
          //value={searchQuery}
          style={styles.ingrSearch}
          inputStyle={{ marginTop: -10 }}
          iconColor={colors.mainFontColour}
          placeholderTextColor={colors.mainFontColour} />
      </View>


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
    </View>
  );
}