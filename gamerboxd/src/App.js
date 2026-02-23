import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';

export default function App() {
  const [search, setSearch] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'cb43a91ff78b46828a2f08bdaf1e058a'; // N'oublie pas ta clé !

  // Fonction pour charger les jeux (soit "populaires", soit "recherchés")
  const fetchGames = (query = '') => {
    setLoading(true);
    // Si search est vide, on prend les jeux populaires, sinon on cherche le nom
    const url = query 
      ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=10`
      : `https://api.rawg.io/api/games?key=${API_KEY}&discover=true&ordering=-relevance&page_size=10`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setGames(data.results);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  // On lance la recherche dès que l'utilisateur arrête de taper pendant 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGames(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>GamerBoxd</Text>
      
      <TextInput 
        style={styles.searchBar}
        placeholder="Rechercher un jeu (ex: Zelda...)"
        placeholderTextColor="#888"
        value={search}
        onChangeText={(text) => setSearch(text)} // Met à jour l'état search
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff0055" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.gameCard}>
              <Image 
                source={{ uri: item.background_image || 'https://via.placeholder.com/150' }} 
                style={styles.gameImage} 
              />
              <View style={styles.infoContainer}>
                <Text style={styles.gameTitle}>{item.name}</Text>
                <Text style={styles.gameRating}>⭐ {item.rating}/5</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun jeu trouvé.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  mainTitle: { color: '#ff0055', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  searchBar: { backgroundColor: '#2a2a2a', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  gameCard: { marginBottom: 20, backgroundColor: '#1e1e1e', borderRadius: 15, overflow: 'hidden', elevation: 5 },
  gameImage: { width: '100%', height: 180 },
  infoContainer: { padding: 12 },
  gameTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  gameRating: { color: '#ffcc00', marginTop: 5 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50 }
});