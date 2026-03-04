import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>GamerBoxd</Text>
        <Text style={styles.subtitle}>Connectez-vous pour noter vos jeux</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe" 
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace('/(tabs)')} // Simule la connexion
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.switchText}>Pas de compte ? <Text style={{color: '#ff0055'}}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  inner: { flex: 1, justifyContent: 'center', padding: 30 },
  logo: { color: '#ff0055', fontSize: 40, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#aaa', textAlign: 'center', marginBottom: 40, marginTop: 10 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  forgotText: { color: '#aaa', textAlign: 'right', marginBottom: 20 },
  button: { backgroundColor: '#ff0055', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchText: { color: '#aaa', textAlign: 'center', marginTop: 30 }
});