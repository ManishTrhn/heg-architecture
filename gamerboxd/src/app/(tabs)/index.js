import React, { useState } from 'react'; // On ajoute useState pour surveiller le texte
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  // 1. On crée une variable "search" pour stocker ce qu'on écrit
  const [search, setSearch] = useState('');


  return (

     <SafeAreaView style={styles.container}>

        <Text style={styles.titre_1}>GamerBoxd</Text>
        {/* 2. Ajout de la barre de recherche */}
        <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un jeu..."
        placeholderTextColor="#888" // Couleur du texte de l'espace réservé
        value={search} // Le texte affiché est celui de notre variable
        onChangeText={(text) => setSearch(text)} // Quand on tape, on met à jour la variable 
        />
      </SafeAreaView>

    
  );
}


// C'est ici qu'on définit le "look" (le CSS de l'app)
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 10,  // Évite que le titre touche le haut du téléphone
    paddingHorizontal: 20, // Ajoute de l'espace sur les côtés 
  },

  titre_1: {
    color : '#ff0055',
    fontSize : 32,
    fontWeight: 'bold', // Texte en gras
    letterSpacing: 1, // Espacement entre les lettres
    textAlign: 'center', // Centre le titre

  },

  searchBar: {
    backgroundColor: '#2a2a2a', // Gris foncé pour le champ
    color: '#fff',              // Texte écrit en blanc
    padding: 15,                // Espace intérieur pour que ce soit aéré
    borderRadius: 12,           // Bords arrondis
    fontSize: 16,
    marginTop: 30,              // Espace au-dessus de la barre
  },

});



