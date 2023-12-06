import { Text, View, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { colors, fonts, padding, textStyles } from '../styles/style-constants';


export default function Favourites() {
  return (
    <View style={{ backgroundColor: colors.white, marginBottom: 240 }}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Favourites</Text>

      <View style={styles.favBtnContainer}>
        <TouchableOpacity
          style={[styles.cocktail, { backgroundColor: colors.purple }]}>

          <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image source={require('../assets/images/Alcoholic.png')} style={styles.drinkImg} />

            <View>
              <Text style={styles.drinkText}>Name</Text>
              <Text style={styles.drinkText}>Category</Text>
            </View>
          </View>

          <View style={{ marginRight: 40 }}>
            <Icon name='heart' size={40} color="#ff6161" />
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}