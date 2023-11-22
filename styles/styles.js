import { StyleSheet } from "react-native";
import Constants from 'expo-constants';
import { colors } from './style-constants'

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
});