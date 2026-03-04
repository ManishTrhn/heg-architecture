import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    if (email.length > 5) {
      setSubmitted(true);
      // Simulation d'envoi d'email
    } else {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#ff0055" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Ionicons name="lock-open-outline" size={80} color="#ff0055" style={styles.icon} />
        
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        
        {!submitted ? (
          <>
            <Text style={styles.instructions}>
              Entrez votre email pour recevoir un lien de réinitialisation.
            </Text>

            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Envoyer le lien</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Un email a été envoyé à {email}. Vérifiez votre boîte de réception !
            </Text>
            <TouchableOpacity 
              style={[styles.button, { marginTop: 20 }]} 
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.buttonText}>Retour au login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 30 },
  backButton: { marginTop: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { marginBottom: 20 },
  title: { color: '#ff0055', fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  instructions: { color: '#aaa', textAlign: 'center', marginBottom: 30, fontSize: 16 },
  input: { width: '100%', backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  button: { width: '100%', backgroundColor: '#ff0055', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successContainer: { alignItems: 'center' },
  successText: { color: '#4CAF50', textAlign: 'center', fontSize: 16, fontWeight: '500' }
});