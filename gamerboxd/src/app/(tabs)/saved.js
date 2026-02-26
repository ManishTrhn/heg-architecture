import { View, Text, StyleSheet } from 'react-native';

export default function SavedScreen() {
    return (
    <View style={styles.container}>
      <Text style={styles.text}>Page Sauvegarde (Vierge)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff' }
});