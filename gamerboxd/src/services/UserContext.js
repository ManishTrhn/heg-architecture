import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedGames, setSavedGames] = useState([]);

  // Charger l'utilisateur et les jeux sauvegardés au démarrage
  useEffect(() => {
    loadUser();
    loadSavedGames();
  }, []);

  const loadSavedGames = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedGames');
      if (saved) {
        setSavedGames(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des jeux sauvegardés:', error);
    }
  };

  const addGameToSaved = async (game) => {
    try {
      const updated = [...savedGames, game];
      await AsyncStorage.setItem('savedGames', JSON.stringify(updated));
      setSavedGames(updated);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du jeu:', error);
    }
  };

  const removeGameFromSaved = async (gameId) => {
    try {
      const updated = savedGames.filter(g => g.id !== gameId);
      await AsyncStorage.setItem('savedGames', JSON.stringify(updated));
      setSavedGames(updated);
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
    }
  };

  const isGameSaved = (gameId) => {
    return savedGames.some(g => g.id === gameId);
  };

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erreur lors du chargement utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde utilisateur:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, saveUser, logout, savedGames, addGameToSaved, removeGameFromSaved, isGameSaved }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé avec UserProvider');
  }
  return context;
}
