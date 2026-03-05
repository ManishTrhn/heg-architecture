import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TRENDING_GAMES } from '../../constants/games';
import { useUser } from '../../services/UserContext';

export default function RateGameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addOrUpdateReview, getGameReview } = useUser();

  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    const found = TRENDING_GAMES.find(g => g.id === params.gameId);
    setGame(found);

    const existing = getGameReview(params.gameId);
    if (existing) {
      setRating(existing.rating);
      setReview(existing.review);
    }
  }, [params.gameId]);

  const handleSave = async () => {
    if (rating === 0) {
      Alert.alert('Erreur', 'Sélectionnez une note');
      return;
    }

    await addOrUpdateReview(game.id, game.name, game.image, rating, review);
    Alert.alert('Succès', 'Avis sauvegardé !');
    router.back();
  };

  if (!game) return <SafeAreaView style={styles.container}><Text style={styles.loadingText}>Chargement...</Text></SafeAreaView>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ff0055" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Noter ce jeu</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <Image source={game.image} style={styles.gameImage} />

          <View style={styles.gameInfo}>
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameYear}>
              {game.releaseDate} • Évaluation: ⭐ {game.rating}
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Ma note :</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text
                    style={[
                      styles.star,
                      { color: star <= rating ? '#ff0055' : '#444' }
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <Text style={styles.ratingLabel}>
                {rating} / 5 étoile{rating > 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Section Avis */}
          <View style={styles.reviewSection}> 
            <Text style={styles.sectionTitle}>Mon avis :</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Partagez votre avis sur ce jeu..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={8}
              value={review}
              onChangeText={setReview}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {review.length} / 500 caractères
            </Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Sauvegarder l'avis</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  gameImage: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
  },
  gameInfo: {
    marginBottom: 30,
  },
  gameName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameYear: {
    color: '#888',
    fontSize: 14,
  },
  ratingSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ff0055',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
  },
  ratingLabel: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  reviewSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  reviewInput: {
    backgroundColor: '#0a0a0a',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14,
    minHeight: 120,
    marginBottom: 10,
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#ff0055',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
