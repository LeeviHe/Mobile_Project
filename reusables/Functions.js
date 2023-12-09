export async function getJsonDrinks (url, condition, setJsonData) {
        try {
        const response = await fetch(url + condition);
        if (response.ok) {
            const json = await response.json()
            const data = json.drinks
            setJsonData(data)
            return data
        } else {
            alert('Error retrieving recipes!');
        }
        } catch (err) {
        alert(err);
        }
    }
export async function getJsonIngredients (url, condition, setJsonData) {
        try {
        const response = await fetch(url + condition);
        if (response.ok) {
            const json = await response.json()
            const data = json.ingredients
            setJsonData(data)
        } else {
            alert('Error retrieving recipes!');
        }
        } catch (err) {
        alert(err);
        }
    }

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAVOURITE_DRINKS_KEY } from './Constants';

// Create a context to share the global state
const GlobalContext = createContext();

// Custom hook to access the global state
export const useGlobalState = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [favouritesData, setFavouritesData] = useState([/* Initial data */]);

  // useEffect to fetch data from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from AsyncStorage
        const dataFromStorage = await AsyncStorage.getItem(FAVOURITE_DRINKS_KEY);
        
        // Update the global state with the data
        setFavouritesData(dataFromStorage);
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  // Context provider to make the global state available to the components
  return (
    <GlobalContext.Provider value={{ favouritesData, setFavouritesData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;