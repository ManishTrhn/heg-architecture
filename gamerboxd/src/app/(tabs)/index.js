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
          data={['Tous', 'Action', 'RPG', 'Indie']}
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
        data={TRENDING_GAMES}
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
          
          <View style={{marginVertical: 15, padding: 15, backgroundColor: '#2a2a2a', borderRadius: 12}}>
            <Text style={{color: '#fff', marginBottom: 10, fontWeight: 'bold'}}>Ma note :</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star}>
                  <Text style={{fontSize: 24, color: '#ff0055'}}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
            <TouchableOpacity 
              style={[styles.closeButton, {flex: 1}]} 
              onPress={() => setSelectedGame(null)}
            >
              <Text style={styles.closeButtonText}>Terminer</Text>
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
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



