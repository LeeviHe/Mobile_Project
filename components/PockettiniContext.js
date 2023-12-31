import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const PockettiniContext = createContext();

export const usePockettini = () => useContext(PockettiniContext);

export const PockettiniProvider = ({ children }) => {
  const [pockettinis, setPockettinis] = useState([]);

  useEffect(() => {
    const loadPockettinis = async () => {
      const storedPockettinis = await AsyncStorage.getItem('pockettinis');
      if (storedPockettinis) {
        setPockettinis(JSON.parse(storedPockettinis));
      }
    };

    loadPockettinis();
  }, []);

  const addPockettini = async (pockettini) => {
    const newPockettinis = [...pockettinis, pockettini];
    setPockettinis(newPockettinis);
    await AsyncStorage.setItem('pockettinis', JSON.stringify(newPockettinis));
  };

  const removePockettini = async (index) => {
    const newPockettinis = pockettinis.filter((_, i) => i !== index);
    setPockettinis(newPockettinis);
    await AsyncStorage.setItem('pockettinis', JSON.stringify(newPockettinis));
  };

  const updatePockettini = async (index, updatedPockettini) => {
    setPockettinis(pockettinis => {
      const newPockettinis = [...pockettinis];
      newPockettinis[index] = updatedPockettini;
      AsyncStorage.setItem('pockettinis', JSON.stringify(newPockettinis));
      return newPockettinis;
    });
  };

  return (
    <PockettiniContext.Provider value={{ pockettinis, addPockettini, removePockettini, updatePockettini }}>
      {children}
    </PockettiniContext.Provider>
  );
};
