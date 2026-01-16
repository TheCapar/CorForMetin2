// HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sayfalar arası geçiş için tipler (TypeScript için)
interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ana Menü</Text>
        <Text style={styles.headerSubtitle}>Neler yapmak istersin?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        
        {/* 1. BUTON: KARAKTER EKLE */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#FF6B6B' }]} 
          onPress={() => navigation.navigate('AddCharacter')}
        >
          <Ionicons name="person-add-outline" size={32} color="white" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Karakter Ekle</Text>
            <Text style={styles.cardDescription}>Yeni bir karakter oluştur ve kaydet.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* 2. BUTON: KARAKTER LİSTESİ */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#4ECDC4' }]} 
          onPress={() => navigation.navigate('CharacterList')}
        >
          <Ionicons name="people-outline" size={32} color="white" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Karakter Listesi</Text>
            <Text style={styles.cardDescription}>Kayıtlı tüm karakterleri gör.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* 3. BUTON: AYLIK SONUÇ */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#1A535C' }]} 
          onPress={() => navigation.navigate('MounthlyStats')}
        >
          <Ionicons name="stats-chart-outline" size={32} color="white" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Aylık Sonuç</Text>
            <Text style={styles.cardDescription}>İstatistikleri ve raporları incele.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  menuContainer: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
});