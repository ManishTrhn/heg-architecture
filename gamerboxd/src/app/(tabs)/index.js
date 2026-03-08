import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity, Modal, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TRENDING_GAMES } from '../../constants/games';
import GameCard from '../../components/GameCard';
import { useUser } from '../../services/UserContext';

export default function App() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedGame, setSelectedGame] = useState(null);
  const { addGameToSaved, isGameSaved } = useUser();
  const router = useRouter();

  return (
    <SafeAreaProvider>
     <SafeAreaView style={styles.container}>

        <Text style={styles.titre_1}>GamerBoxd</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un jeu..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

       <View style={styles.filterContainer}>
        <FlatList
          data={[
            'Tous',
            // build unique genre list from the available games
            ...new Set(TRENDING_GAMES.map((g) => g.genre).filter(Boolean)),
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === item && styles.activeBtn]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.activeTxt]}>{item}</Text>
            </TouchableOpacity>
          )}
        />


      </View>
        <Text style={styles.sectionTitle}>Jeux du moment</Text>
        
       <FlatList
        data={
          // apply search + genre filter to the list of games
          TRENDING_GAMES.filter((game) => {
            const matchesSearch = game.name
              .toLowerCase()
              .includes(search.toLowerCase());
            const matchesGenre =
              activeFilter === 'Tous' || game.genre === activeFilter;
            return matchesSearch && matchesGenre;
          })
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => {
              console.log("jeu cliqué :", item.name);
              setSelectedGame(item);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
<Modal 
  visible={selectedGame !== null}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setSelectedGame(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {selectedGame && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={selectedGame.image} style={styles.modalImage} />
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={styles.modalTitle}>{selectedGame.name}</Text>
            <TouchableOpacity onPress={() => setSelectedGame(null)}>
               <Text style={{color: '#888', fontSize: 20}}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>{selectedGame.releaseDate} • ⭐ {selectedGame.rating}</Text>
          {selectedGame.genre && (
            <Text style={[styles.modalSubtitle, {marginTop: 4}]}>Genre : {selectedGame.genre}</Text>
          )}
          
          <Text style={styles.modalDescription}>
            Ceci est une description prototype pour {selectedGame.name}. 
            Un jeu incontournable pour les fans du genre !
          </Text>

          <View style={{flexDirection: 'row', gap: 10, marginBottom: 30}}>
            <TouchableOpacity 
              style={[styles.closeButton, {flex: 1, backgroundColor: '#ff0055'}]} 
              onPress={() => {
                setSelectedGame(null);
                router.push({
                  pathname: '/(tabs)/rate-game',
                  params: { gameId: selectedGame.id }
                });
              }}
            >
              <Text style={[styles.closeButtonText, {color: '#fff'}]}>⭐ Noter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.closeButton, {flex: 1, backgroundColor: '#2a2a2a', borderWidth: 2, borderColor: '#ff0055'}]} 
              onPress={async () => {
                if (isGameSaved(selectedGame.id)) {
                  Alert.alert('Info', 'Ce jeu est déjà dans votre liste !');
                } else {
                  await addGameToSaved(selectedGame);
                  Alert.alert('Succès', 'Jeu ajouté à votre liste "Jeux à faire" !');
                  setSelectedGame(null);
                }
              }}
            >
              <Text style={[styles.closeButtonText, {color: '#ff0055'}]}>💾 Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  </View>        
</Modal>

      {selectedGame && <Text style={{color: '#fff', textAlign: 'center', marginTop: 10}}>sélectionné : {selectedGame.name}</Text>}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// C'est ici qu'on définit le "look" (le CSS de l'app)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  titre_1: {
    color: '#ff0055',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
  },
  sectionTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 15, 
    marginTop: 10 
  },
  searchBar: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
  },
  filterContainer: {
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  activeBtn: {
    backgroundColor: '#ff0055',
  },
  filterText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTxt: {
    color: '#fff',
  },

  // --- Styles du Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    height: '80%',
  },
modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#ff0055',
    fontSize: 14,
    marginVertical: 10,
  },
  modalYear: {
    color: '#ff0055',
    fontSize: 16,
    marginVertical: 10,
  },
  modalDescription: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: '#ff0055',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    marginHorizontal: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});



