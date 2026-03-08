import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  ScrollView, Image, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
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
      Alert.alert('Erreur', 'Veuillez sélectionner une note avant de sauvegarder.');
      return;
    }

    try {
      await addOrUpdateReview(game.id, game.name, game.image, rating, review);
      Alert.alert('Succès', 'Votre avis a été enregistré !');
      router.back();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l’avis.');
    }
  };

  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-outline" size={28} color="#ff0055" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Noter ce jeu</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Game Info Card */}
          <View style={styles.gameHeaderCard}>
            <Image source={game.image} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>{game.name}</Text>
              <Text style={styles.gameYear}>
                {game.releaseDate} • ⭐ {game.rating}
              </Text>
            </View>
          </View>

          {/* Star Rating Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ma note</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={star <= rating ? "star" : "star-outline"} 
                    size={42} 
                    color={star <= rating ? '#ff0055' : '#444'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingLabel}>{rating} / 5 étoiles</Text>
            )}
          </View>

          {/* Review Text Input */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mon avis (optionnel)</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Qu'avez-vous pensé de l'histoire, du gameplay..."
              placeholderTextColor="#666"
              multiline
              maxLength={500}
              value={review}
              onChangeText={setReview}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{review.length} / 500</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.modernButton, { backgroundColor: '#ff9900' }]}
              onPress={() => {
                if (rating === 0) {
                  Alert.alert('Erreur', 'Veuillez sélectionner une note avant de valider.');
                  return;
                }
                router.back();
              }}
            >
              <Ionicons name="star" size={24} color="#fff" />
              <Text style={styles.modernButtonText}>Noter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modernButton, styles.saveModern]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.modernButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  gameHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 15,
  },
  gameImage: { width: 80, height: 110, borderRadius: 8 },
  gameInfo: { marginLeft: 15, flex: 1 },
  gameName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  gameYear: { color: '#aaa', fontSize: 14 },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: { color: '#ff0055', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  ratingLabel: { color: '#aaa', textAlign: 'center', marginTop: 10, fontSize: 14 },
  reviewInput: {
    backgroundColor: '#0a0a0a',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    minHeight: 150,
    fontSize: 16,
  },
  charCount: { color: '#666', fontSize: 12, textAlign: 'right', marginTop: 8 },
  actionButtons: { marginTop: 12, gap: 12 },
  modernButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 14,
    gap: 10,
  },
  saveModern: { backgroundColor: '#ff0055' },
  modernButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  loadingText: { color: '#fff', textAlign: 'center', marginTop: 50 },
});