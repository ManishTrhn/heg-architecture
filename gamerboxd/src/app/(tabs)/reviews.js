import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../services/UserContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewsScreen() {
  const { gameReviews, removeReview } = useUser();
  const router = useRouter();
  const [selectedReview, setSelectedReview] = useState(null);

  const handleDelete = (gameId) => {
    Alert.alert('Supprimer', 'Êtes-vous sûr ?', [
      { text: 'Annuler' },
      {
        text: 'Supprimer',
        onPress: async () => {
          await removeReview(gameId);
          setSelectedReview(null);
          Alert.alert('Succès', 'Avis supprimé !');
        },
        style: 'destructive',
      },
    ]);
  };

  const stars = (rating) => [...Array(5)].map((_, i) => (
    <Text key={i} style={{ fontSize: 16, color: i < rating ? '#ff0055' : '#444' }}>★</Text>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mes Notes</Text>

      {gameReviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={60} color="#ff0055" />
          <Text style={styles.emptyText}>Aucune note ajoutée</Text>
          <Text style={styles.emptySubtext}>Notez vos jeux favoris et partagez votre avis</Text>
        </View>
      ) : (
        <FlatList
          data={gameReviews}
          keyExtractor={(item) => item.gameId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.reviewCard}
              onPress={() => setSelectedReview(item)}
            >
              <Image
                source={typeof item.gameImage === 'string' ? { uri: item.gameImage } : item.gameImage}
                style={styles.reviewImage}
              />
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewGameName}>{item.gameName}</Text>
                <View style={styles.starsContainer}>
                  {stars(item.rating)}
                </View>
                <Text style={styles.reviewPreview} numberOfLines={2}>
                  {item.review || 'Pas d\'avis écrit'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push({
                  pathname: '/(tabs)/rate-game',
                  params: { gameId: item.gameId }
                })}
              >
                <Ionicons name="pencil" size={20} color="#ff0055" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Modal pour afficher l'avis complet */}
      <Modal
        visible={selectedReview !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedReview(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => setSelectedReview(null)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>

              {selectedReview && (
                <>
                  <Image
                    source={typeof selectedReview.gameImage === 'string' ? { uri: selectedReview.gameImage } : selectedReview.gameImage}
                    style={styles.modalImage}
                  />

                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedReview.gameName}</Text>
                    <View style={styles.modalStars}>
                      {stars(selectedReview.rating)}
                    </View>
                  </View>

                  <View style={styles.reviewTextContainer}>
                    <Text style={styles.reviewLabel}>Mon avis :</Text>
                    <Text style={styles.fullReviewText}>
                      {selectedReview.review || 'Pas d\'avis écrit'}
                    </Text>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editBtn]}
                      onPress={() => {
                        setSelectedReview(null);
                        router.push({
                          pathname: '/(tabs)/rate-game',
                          params: { gameId: selectedReview.gameId }
                        });
                      }}
                    >
                      <Ionicons name="pencil" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteBtn]}
                      onPress={() => {
                        setSelectedReview(null);
                        handleDelete(selectedReview.gameId);
                      }}
                    >
                      <Ionicons name="trash" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    color: '#ff0055',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  reviewImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewGameName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    gap: 3,
  },
  reviewPreview: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
  editButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 30,
  },
  closeModal: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 15,
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  modalHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalStars: {
    flexDirection: 'row',
    gap: 5,
  },
  reviewTextContainer: {
    backgroundColor: '#1e1e1e',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  reviewLabel: {
    color: '#ff0055',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fullReviewText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#ff0055',
  },
  deleteBtn: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
