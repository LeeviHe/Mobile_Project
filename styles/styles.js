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
    width: 200,
    height: 140
  },
  page: {
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
  filterSearch: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mainFontColour,
    height: 35,
    width: 250,
    backgroundColor: 'white',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchBtn: {
    borderWidth: 1,
    borderColor: colors.mainFontColour,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderLeftWidth: 0,
    backgroundColor: '#FFF48D40',
    paddingHorizontal: 10
  },
  ingrSearch: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mainFontColour,
    marginHorizontal: 20,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  drinkImg: {
    width: 75,
    height: 85
  },
  cocktailInfo: {
    justifyContent: "center",
    marginLeft: 20,
    gap: 5
  },
  drinkText: {
    color: colors.textColour,
    fontFamily: fonts.text,
    width: 200
  },
  imgShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  // FILTER
  filterScrollView: {
    borderTopWidth: 1,
    backgroundColor: '#FFF48D40',
    borderTopColor: '#CEC56F',
    height: '100%'
  },
  applyBtn: {
    backgroundColor: '#dbd484',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterHeading: {
    fontFamily: fonts.header,
    color: colors.mainFontColour,
    fontSize: 20
  },
  filterContainer: {
    marginVertical: 20,
    gap: 20,
    flexDirection: 'row'
  },
  filterSort: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center'
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    marginBottom: 20
  },
  drinkName: {
    fontFamily: fonts.header,
    color: colors.textColour,
    fontSize: 20,
    width: 230,
    textAlign: 'center'
  },
  drinkCategory: {
    fontFamily: fonts.text,
    color: colors.smallFontColour
  },
  ingredientList: {
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: "center",
    padding: 6,
    backgroundColor: 'white',
  },
  listItem: {
    flexDirection: 'row',
    gap: 20,
    marginLeft: 10,
    minHeight: 20,
    maxHeight: 'auto'
  },
  measure: {
    fontFamily: fonts.boldText,
    width: 80
  },
  ingredient: {
    fontFamily: fonts.text,
    flexWrap: "wrap",
    width: 170
  },
  ingrName: {
    width: 190
  },
  prepList: {
    marginTop: 10,
    gap: 5,
    marginHorizontal: 20
  },
  prepItem: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.mainFontColour,
    justifyContent: 'space-between',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: "center",
    padding: 10,
    backgroundColor: 'white'
  },
  prepName: {
    width: 290
  },
  step: {
    color: colors.mainFontColour,
    fontFamily: fonts.text,
    fontSize: 12
  },
  prep: {
    fontFamily: fonts.text,
    width: 280
  },
  note: {
    fontFamily: fonts.text,
    width: 280
  },
  noteBtn: {
    backgroundColor: colors.grayBtn,
    borderRadius: 10,
    marginTop: 10,
    padding: 6
  },

  // MY INGREDIENTS
  topIngrColActive: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  topIngrCol: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  topIngrNbr: {
    borderRadius: 50,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  myCol: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: '#5c849480'
  },
  myBtn: {
    borderRadius: 50,
    backgroundColor: colors.white,
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: colors.mainFontColour,
    padding: 2
  },

  // MORE
  moreContainer: {
    gap: 10,
    position: "absolute",
    bottom: 20,
    right: 0,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10
  },
  moreItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  moreText: {
    fontSize: 16,
    fontFamily: fonts.text,
    paddingHorizontal: 20
  },

  //my pockettinis
  btnContainer: {
    marginHorizontal: 5,
    gap: 10,
    marginTop: 50
  },
  addDrinkBtn: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: '#ffac5f50',
    padding: 20,
    alignItems: 'center'
  },
  btnInfo: {
    paddingHorizontal: 40,
    gap: 5
  },

  // make a pockettini
  partContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    gap: 10
  },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfdfdf',
    width: 200,
    height: 200
  },
  editAmount: {
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: '#dfdfdf',
    flexBasis: 'auto',
    justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  measureView: {
    flexDirection: 'row',
    gap: 10,
  },
  editMeasure: {
    fontFamily: fonts.boldText,
    color: colors.mainFontColour
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    backgroundColor: 'white',
    flexBasis: '40%',
    height: 40,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  inputViewLarge: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.mainFontColour,
    justifyContent: 'space-between',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: "center",
    padding: 10,
    backgroundColor: 'white',
    minHeight: 60,
    maxHeight: 'auto'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  addBtn: {
    color: colors.white,
    fontFamily: fonts.text,
    alignSelf: 'center'
  },

  //my favourites
  favBtnContainer: {
    marginHorizontal: 5,
    gap: 10,
    marginTop: 50
  },
});