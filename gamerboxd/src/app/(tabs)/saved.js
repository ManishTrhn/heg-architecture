import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../services/UserContext';
import { Ionicons } from '@expo/vector-icons';
import GameCard from '../../components/GameCard';

export default function SavedScreen() {
  const { savedGames, removeGameFromSaved } = useUser();
  const [selectedGame, setSelectedGame] = useState(null);

  const handleDeleteGame = (gameId) => {
    Alert.alert(
      'Supprimer',
      'Êtes-vous sûr de vouloir supprimer ce jeu de votre liste ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: async () => {
            await removeGameFromSaved(gameId);
            Alert.alert('Succès', 'Jeu supprimé de votre liste !');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mes Jeux</Text>
      
      {savedGames.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={60} color="#ff0055" />
          <Text style={styles.emptyText}>Aucun jeu sauvegardé</Text>
          <Text style={styles.emptySubtext}>Ajoutez des jeux à votre liste "Jeux à faire"</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>🎮 Jeux à faire</Text>
          <FlatList
            data={savedGames}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.gameItemContainer}>
                <TouchableOpacity
                  style={styles.gameItem}
                  onPress={() => setSelectedGame(item)}
                >
                  <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={styles.gameImage}
                  />
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameName}>{item.name}</Text>
                    <Text style={styles.gameYear}>
                      {item.releaseDate} • {item.genre ? item.genre + ' • ' : ''}⭐ {item.rating}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGame(item.id)}
                >
                  <Ionicons name="trash" size={24} color="#ff0055" />
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Modal pour les détails du jeu */}
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
                <TouchableOpacity
                  style={styles.closeModal}
                  onPress={() => setSelectedGame(null)}
                >
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Image
                  source={typeof selectedGame.image === 'string' ? { uri: selectedGame.image } : selectedGame.image}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedGame.name}</Text>
                <Text style={styles.modalSubtitle}>{selectedGame.releaseDate} • ⭐ {selectedGame.rating}</Text>
                {selectedGame.genre && (
                  <Text style={[styles.modalSubtitle, {marginTop: 4}]}>Genre : {selectedGame.genre}</Text>
                )}
                <Text style={styles.modalDescription}>
                  Ceci est une description prototype pour {selectedGame.name}.
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton2}
                  onPress={() => {
                    handleDeleteGame(selectedGame.id);
                    setSelectedGame(null);
                  }}
                >
                  <Text style={styles.deleteButtonText}>Supprimer de ma liste</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20 },
  title: { color: '#ff0055', fontSize: 28, fontWeight: 'bold', marginTop: 10, marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 15, marginTop: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 18, marginTop: 15, fontWeight: '600' },
  emptySubtext: { color: '#888', fontSize: 14, marginTop: 8 },
  
  gameItemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  gameItem: { flex: 1, flexDirection: 'row', backgroundColor: '#1e1e1e', borderRadius: 12, overflow: 'hidden' },
  gameImage: { width: 80, height: 110, resizeMode: 'cover' },
  gameInfo: { padding: 12, flex: 1, justifyContent: 'center' },
  gameName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  gameYear: { color: '#888', fontSize: 12 },
  
  deleteButton: { marginLeft: 10, padding: 10 },
  deleteButton2: { backgroundColor: '#ff0055', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 30 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e1e1e', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '80%' },
  closeModal: { alignSelf: 'flex-end', padding: 10 },
  modalImage: { width: '100%', height: 250, borderRadius: 15, marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  modalSubtitle: { color: '#ff0055', fontSize: 14, marginVertical: 10 },
  modalDescription: { color: '#ccc', fontSize: 16, lineHeight: 24, marginBottom: 30 },
});