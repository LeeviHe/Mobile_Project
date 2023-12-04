import { StyleSheet } from "react-native";
import Constants from 'expo-constants';
import { colors, fonts } from './style-constants'

export default StyleSheet.create({
  // HOME & APP
  container: {
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: colors.white
  },
  logo: {
    alignSelf: "center",
    width: 240,
    height: 50
  },
  pageSlider: {
    width: '100%',
    paddingVertical: 10
  },
  carouselImage: {
    width: '80%',
    height: 150
  },
  page: {
    width: '100%',
    height: 210,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardCol: {
    borderRadius: 10,
    paddingVertical: 20
  },
  cardTitle: {
    fontSize: 18,
    color: colors.secondaryFontColour,
    fontFamily: fonts.header,
    alignSelf: "center"
  },
  cardText: {
    fontSize: 12,
    color: '#6c6c6c',
    fontFamily: fonts.header,
    alignSelf: "center",
    textAlign: "center",
    marginTop: 5
  },
  cardImg: {
    width: '100%',
    height: 100,
    alignSelf: "center",
    marginTop: 20
  },
  map: {
    width: '100%',
    height: '45%'
  },
  alko: {
    width: 40,
    height: 40
  },
  mapView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 20,
    alignItems: "center",
    gap: 10
  },

  // COCKTAILS & INGREDIENTS
  searchFilterRow: {
    alignItems: 'center',
    gap: 20
  },
  searchFilterCol: {
    flexBasis: '45%'
  },
  search: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mainFontColour,
    marginLeft: 30,
    height: 35,
    backgroundColor: 'white'
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: colors.mainFontColour,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 30,
    paddingHorizontal: 5
  },
  drinkContainer: {
    marginHorizontal: 5
  },
  cocktail: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 10
  },
  drinkImg: {
    width: 75,
    height: 85,
    marginLeft: 20
  },
  cocktailInfo: {
    justifyContent: "center",
    marginLeft: 20,
    gap: 5
  },
  drinkText: {
    color: colors.textColour,
    fontFamily: fonts.text
  },

  // RECIPE PAGE
  recipeContainer: {
    backgroundColor: colors.white
  },
  topBar: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 30,
    alignItems: "center",
    marginHorizontal: 20
  },
  drinkInfo: {
    alignItems: 'center',
    gap: 25,
    marginBottom: 20,
  },
  drinkName: {
    fontFamily: fonts.header,
    color: colors.textColour,
    fontSize: 20
  },
  drinkCategory: {
    fontFamily: fonts.text,
    color: colors.smallFontColour
  },
  ingredientList: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: "center"
  },
  listItem: {
    flexDirection: 'row',
    gap: 20,
    marginLeft: 10
  },
  checkbox: {
    backgroundColor: 'red'
  }
});