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

  return (
    <ScrollView>
      <View style={styles.recipeContainer}>
        <Text>
          myrecipe
        </Text>
      </View>
    </ScrollView>
  );
};

export default Recipe;