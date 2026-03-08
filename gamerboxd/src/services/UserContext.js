import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedGames, setSavedGames] = useState([]);
  const [gameReviews, setGameReviews] = useState([]);

  // Charger l'utilisateur et les jeux sauvegardés au démarrage
  useEffect(() => {
    loadUser();
    loadSavedGames();
    loadGameReviews();
  }, []);

  const loadSavedGames = async () => {
    const data = await AsyncStorage.getItem('savedGames');
    if (data) setSavedGames(JSON.parse(data));
  };

  const loadGameReviews = async () => {
    const data = await AsyncStorage.getItem('gameReviews');
    if (data) setGameReviews(JSON.parse(data));
  };

  const addGameToSaved = async (game) => {
    const all = [...savedGames, game];
    await AsyncStorage.setItem('savedGames', JSON.stringify(all));
    setSavedGames(all);
  };

  const removeGameFromSaved = async (gameId) => {
    const updatedSavedGames = savedGames.filter(g => g.id !== gameId);
    const updatedReviews = gameReviews.filter(r => r.gameId !== gameId);

    await AsyncStorage.setItem('savedGames', JSON.stringify(updatedSavedGames));
    await AsyncStorage.setItem('gameReviews', JSON.stringify(updatedReviews));

    setSavedGames(updatedSavedGames);
    setGameReviews(updatedReviews);
  };

  const isGameSaved = (gameId) => {
    return savedGames.some(g => g.id === gameId);
  };

  const loadUser = async () => {
    const data = await AsyncStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
    setLoading(false);
  };

  const saveUser = async (userData) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const addOrUpdateReview = async (gameId, gameName, gameImage, rating, review) => {
    const idx = gameReviews.findIndex(r => r.gameId === gameId);
    let all;

    if (idx >= 0) {
      all = [...gameReviews];
      all[idx] = { gameId, gameName, gameImage, rating, review };
    } else {
      all = [...gameReviews, { gameId, gameName, gameImage, rating, review }];
    }

    await AsyncStorage.setItem('gameReviews', JSON.stringify(all));
    setGameReviews(all);
  };

  const getGameReview = (gameId) => gameReviews.find(r => r.gameId === gameId);

  const removeReview = async (gameId) => {
    const all = gameReviews.filter(r => r.gameId !== gameId);
    await AsyncStorage.setItem('gameReviews', JSON.stringify(all));
    setGameReviews(all);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      saveUser, 
      logout, 
      savedGames, 
      addGameToSaved, 
      removeGameFromSaved, 
      isGameSaved,
      gameReviews,
      addOrUpdateReview,
      getGameReview,
      removeReview
    }}>
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
