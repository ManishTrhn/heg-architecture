import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../services/UserContext';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const { saveUser } = useUser();

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    const data = {
      firstname: form.firstname,
      lastname: form.lastname,
      username: form.username,
      email: form.email,
    };
    
    await saveUser(data);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ff0055" />
        </TouchableOpacity>

        <Text style={styles.title}>Rejoindre GamerBoxd</Text>
        <Text style={styles.subtitle}>Créez votre profil de gamer</Text>

        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 10 }]} 
            placeholder="Prénom" 
            placeholderTextColor="#888"
            onChangeText={(t) => setForm({...form, firstname: t})}
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Nom" 
            placeholderTextColor="#888"
            onChangeText={(t) => setForm({...form, lastname: t})}
          />
        </View>

        <TextInput 
          style={styles.input} 
          placeholder="Nom d'utilisateur" 
          placeholderTextColor="#888"
          onChangeText={(t) => setForm({...form, username: t})}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#888"
          keyboardType="email-address"
          onChangeText={(t) => setForm({...form, email: t})}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe" 
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={(t) => setForm({...form, password: t})}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Confirmer le mot de passe" 
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={(t) => setForm({...form, confirmPassword: t})}
        />

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgree(!agree)}>
          <View style={[styles.checkbox, agree && styles.checkboxActive]}>
            {agree && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.checkboxLabel}>J'accepte les conditions d'utilisation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, !agree && { opacity: 0.5 }]} 
          disabled={!agree}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Créer mon compte</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  inner: { padding: 30, paddingTop: 60 },
  backButton: { marginBottom: 20 },
  title: { color: '#ff0055', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#aaa', marginBottom: 30 },
  row: { flexDirection: 'row', marginBottom: 15 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#ff0055', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#ff0055' },
  checkboxLabel: { color: '#aaa', fontSize: 14 },
  button: { backgroundColor: '#ff0055', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});