import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAVOURITE_DRINKS_KEY, OWNED_INGR_KEY } from '../reusables/Constants';

const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favouritesData, setFavouritesData] = useState([]);
  const [ownedData, setOwnedData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favDataFromStorage = await AsyncStorage.getItem(FAVOURITE_DRINKS_KEY);
        const ownedDataFromStorage = await AsyncStorage.getItem(OWNED_INGR_KEY)
        if (favDataFromStorage) {
            setFavouritesData(JSON.parse(favDataFromStorage))
        }
        if (ownedDataFromStorage) {
            setOwnedData(JSON.parse(ownedDataFromStorage))
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };
    fetchData();
  }, []);

  const addFavourite = async (drinkInfo) => {
    const newFavourites = [...favouritesData, drinkInfo]
    setFavouritesData(newFavourites)
    await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavourites))
  }

  const removeFavourite = async (index) => {
    const newFavourites = favouritesData.filter((fav) => fav.idDrink !== index)
    setFavouritesData(newFavourites)
    await AsyncStorage.setItem(FAVOURITE_DRINKS_KEY, JSON.stringify(newFavourites))
  }

  const addOwned = async (ingrInfo) => {
    const newOwned = [...ownedData, ingrInfo]
    setOwnedData(newOwned)
    await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
  }

  const removeOwned = async (index) => {
    const newOwned = ownedData.filter((own) => own.idIngredient !== index)
    setOwnedData(newOwned)
    await AsyncStorage.setItem(OWNED_INGR_KEY, JSON.stringify(newOwned))
  }

  return (
    <FavouritesContext.Provider value={{ favouritesData, setFavouritesData, ownedData, setOwnedData, addFavourite, removeFavourite, addOwned, removeOwned}}>
      {children}
    </FavouritesContext.Provider>
  );
};