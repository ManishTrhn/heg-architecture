import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../services/UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff0055" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={50} color="#ff0055" />
        </View>
        <Text style={styles.userName}>{user?.username || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@exemple.com'}</Text>
        {user?.firstname && (
          <Text style={styles.userInfo}>{user.firstname} {user.lastname}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 50 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: '#ff0055' },
  userName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  userEmail: { color: '#888', fontSize: 16, marginTop: 5 },
  userInfo: { color: '#aaa', fontSize: 14, marginTop: 5 },
  logoutButton: { backgroundColor: '#ff0055', flexDirection: 'row', padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 30 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});