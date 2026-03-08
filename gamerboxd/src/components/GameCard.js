import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function GameCard({ game, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={game.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{game.name}</Text>
        <Text style={styles.subtitle}>
          {game.releaseDate} • {game.genre ? game.genre + ' • ' : ''}⭐ {game.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  info: { 
    padding: 15, 
    justifyContent: 'center' 
  },
  title: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  subtitle: { color: '#888', marginTop: 5 },
});