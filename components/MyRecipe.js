import React from 'react';
import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/styles';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { StatusBar } from 'expo-status-bar';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { LinearGradient } from 'expo-linear-gradient';

const MyRecipe = ({ navigation, route }) => {
  const pockettini = route.params.pockettini;
  const { backgroundColor } = route.params;

  if (!pockettini) {
    console.error("No pockettini data available");
    return <View><Text>No Data</Text></View>;
  }

  const ingredientsList = pockettini.drinkIngredients && pockettini.drinkIngredients.length > 0
    ? pockettini.drinkIngredients.map((ingredient, index) => (

      <View key={index} style={styles.ingredientList}>
        <View style={styles.listItem}>
          <Text style={styles.measure}>{ingredient.number} {ingredient.amount}</Text>
          <Text style={styles.ingredient}>{ingredient.name}</Text>
        </View>

        <BouncyCheckbox
          size={22}
          fillColor="gray"
          unfillColor="#FFFFFF"
          iconStyle={{ borderColor: "gray" }}
          innerIconStyle={{ borderWidth: 1 }} />
      </View>
    ))
    : <Text>No ingredients available</Text>;

  const preparationSteps = pockettini.steps.map((step, index) => (
    <View key={index} style={styles.prepItem}>
      <View>
        <Text style={styles.step}>{`Step #${index + 1}`}</Text>
        <Text style={styles.prep}>{step}</Text>
      </View>

      <BouncyCheckbox
        size={22}
        fillColor={colors.mainFontColour}
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: "gray" }}
        innerIconStyle={{ borderWidth: 1 }} />
    </View>
  ));

  const notesList = pockettini.notes.map((note, index) => (
    <View key={index} style={[styles.shadow, { borderRadius: 5, backgroundColor: 'white' }]}>
      <View style={styles.inputViewLarge}>
        <Text style={{ fontFamily: fonts.text }}>{note}</Text>

        <BouncyCheckbox
          size={22}
          fillColor={colors.mainFontColour}
          unfillColor="#FFFFFF"
          iconStyle={{ borderColor: "gray" }}
          innerIconStyle={{ borderWidth: 1 }} />
      </View>
    </View>
  ));

  return (
    <ScrollView>
      <View style={styles.recipeContainer}>
        <StatusBar hidden={true} />

        <ImageBackground
          source={{ uri: pockettini.drinkImg }}
          resizeMode="cover"
          opacity={0.5}
          blurRadius={30}
          style={{ paddingVertical: 30 }}>

          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-left" size={30} color={colors.mainFontColour} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MakeAPockettini',
                  {
                    pockettini: pockettini,
                    index: route.params.index
                  })}
              style={[styles.saveBtn, { backgroundColor: colors.mainFontColour }]}>
              <Text style={{ color: colors.white, fontFamily: fonts.text }}>edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drinkInfo}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.drinkName}>{pockettini.drinkName}</Text>
              <Text style={styles.drinkCategory}>{pockettini.drinkCategory}</Text>
            </View>

            <View>
              <Image style={{ width: 200, height: 200 }} source={{ uri: pockettini.drinkImg }} />
            </View>
          </View>
        </ImageBackground>

        <View style={{ backgroundColor: backgroundColor, paddingTop: 20, paddingBottom: 30 }}>

          <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Ingredients</Text>

          <View style={{ marginTop: 20, justifyContent: 'center', gap: 10 }}>{ingredientsList}</View>

          <View style={{ marginTop: 30, gap: 10, marginHorizontal: 20 }}>
            <Text style={[textStyles.H1Upper, { marginLeft: 40, marginBottom: 10 }]}>Preparation</Text>
            {preparationSteps}
          </View>

          <View style={{ gap: 10, marginTop: 30, marginHorizontal: 20 }}>
            <Text style={[textStyles.H1Upper, { marginLeft: 40 }]}>Notes</Text>
            {notesList}

            <TouchableOpacity style={styles.noteBtn}>
              <Text style={[textStyles.H1Upper, { color: colors.white, fontFamily: fonts.text, alignSelf: 'center' }]}>Add notes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView >
  );
};

export default MyRecipe;