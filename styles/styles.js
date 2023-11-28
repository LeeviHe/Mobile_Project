import { StyleSheet } from "react-native";
import Constants from 'expo-constants';
import { colors, fonts } from './style-constants'

export default StyleSheet.create({
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
    height: '40%'
  }
});