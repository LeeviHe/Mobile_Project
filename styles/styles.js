import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: '#f5f5f5'
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
  H1: {
    color: '#5A5A5A',
    fontFamily: 'Raleway',
    fontSize: 20,
    marginTop: 20,
    paddingBottom: 50
  },
  page: {
    width: '100%',
    height: 210,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
});