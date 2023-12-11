import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts, textStyles } from '../styles/style-constants';
import { usePockettini } from './PockettiniContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-virtualized-view';

export default function MyPockettinis({ navigation, route }) {
  const { pockettinis, removePockettini } = usePockettini();

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
          onPress: () => removePockettini(index)
        }
      ]
    );
  }

const isAlcoholic = (category) => {
    const alcoholicCategories = [
      'Ordinary Drink',
      'Cocktail',
      'Shot',
      'Homemade Liqueur',
      'Punch / Party Drink',
      'Beer'
    ]
    return alcoholicCategories.includes(category)
  }

  const isNotAlcoholic = (category) => {
    const nonAlcoholicCategories = [
      'Shake',
      'Cocoa'
    ]
    return nonAlcoholicCategories.includes(category)
  }

  const categoryBackgroundColor = (item) => {
    const categoryColors = {
      'Coffee / Tea': colors.brown,
      'Other / Unknown': '#999',
      'Alcoholic': colors.purple,
      'Non Alcoholic': colors.green,
      'Soft Drink': colors.yellow
    }
    if (item.drinkCategory) {
      return isAlcoholic(item.drinkCategory)
        ? categoryColors['Alcoholic']
        : isNotAlcoholic(item.drinkCategory)
          ? categoryColors['Non Alcoholic']
          : categoryColors[item.drinkCategory] || colors.purple;
    } 
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white}}>
      <Text style={[textStyles.pageTitle, textStyles.spacingHelp]}>My Pockettinis</Text>

      <View style={styles.btnContainer}>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MakeAPockettini')}>
          <View style={styles.addDrinkBtn}>
            <Image source={require('../assets/images/plus.png')}
              style={{ height: 50, width: 50 }} />

            <View style={styles.btnInfo}>
              <Text style={{ fontFamily: fonts.header, fontSize: 18 }}>Add a new Pockettini</Text>
              <Text style={{ fontFamily: fonts.text, fontSize: 12 }}>Have any family secrets or custom recipes in mind? Add them here!</Text>
            </View>
          </View>
        </TouchableOpacity>

        {
          pockettinis.map((pockettini, index) => (
            <GestureHandlerRootView>
              <Swipeable
                key={index}
                renderRightActions={() => (
                  <View style={{ alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('MakeAPockettini',
                          { pockettini: pockettinis[index], index })}
                      style={{ justifyContent: 'center' }}>

                      <Icon
                        name='pencil'
                        size={30}
                        color={colors.mainFontColour} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deletePockettini(index)}
                      style={{ justifyContent: 'center' }}>
                      <Icon
                        name='close'
                        size={40}
                        color='#ff6161' />
                    </TouchableOpacity>
                  </View>)}>

                <TouchableOpacity
                  key={index}
                  style={[styles.cocktail, { backgroundColor: categoryBackgroundColor(pockettini) }]}>

                  <View style={[styles.cocktailInfo, { flexDirection: 'row', alignItems: 'center' }]}>

                    {pockettini.drinkImg ? (
                      <Image source={{ uri: pockettini.drinkImg }} style={styles.drinkImg} />
                    ) : (
                      <Image source={require('../assets/images/img-placeholder.jpg')} style={styles.drinkImg} />
                    )}

                    <View style={styles.cocktailInfo}>
                      <Text style={styles.drinkText}>{pockettini.drinkName}</Text>
                      <Text style={styles.drinkText}>{pockettini.drinkCategory}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            </GestureHandlerRootView>
          ))
        }

      </View>

    </ScrollView>
  );
}