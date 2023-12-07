import { Text, View, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';


export default function MyPockettinis() {

  const [isHeartSelected, setHeartSelected] = useState(false);

  const toggleHeart = () => {
    setHeartSelected(!isHeartSelected);
  };

  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Pockettinis</Text>

      <View style={styles.btnContainer}>

        <TouchableOpacity>
          <View style={styles.addDrinkBtn}>
            <Image source={require('../assets/images/plus.png')}
              style={{ height: 50, width: 50 }} />

            <View style={styles.btnInfo}>
              <Text style={{ fontFamily: fonts.header, fontSize: 18 }}>Add a new Pockettini</Text>
              <Text style={{ fontFamily: fonts.text, fontSize: 12 }}>Have any family secrets or custom recipes in mind? Add them here!</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cocktail, { backgroundColor: colors.purple }]}>
          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />
            <View style={styles.cocktailInfo}>
              <Text style={styles.drinkText}>Name</Text>
              <Text style={styles.drinkText}>Category</Text>
            </View>
          </View>

          <View style={{ marginRight: 40 }}>
            <TouchableOpacity onPress={toggleHeart}>
              <Icon name={isHeartSelected ? 'heart' : 'heart-outline'} size={35} color="#ff6161" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}