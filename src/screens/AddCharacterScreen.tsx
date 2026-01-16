// ManageCharactersScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ManageCharactersScreen() {
  const [characterName, setCharacterName] = useState('');
  const [characterList, setCharacterList] = useState<string[]>([]);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const stored = await AsyncStorage.getItem('my_characters'); // Sadece isimleri tutuyoruz
      if (stored) setCharacterList(JSON.parse(stored));
    } catch (e) { console.error(e); }
  };

  const addCharacter = async () => {
    if (!characterName.trim()) return;
    
    // Aynı isimden var mı kontrolü
    if (characterList.some(c => c.toLowerCase() === characterName.trim().toLowerCase())) {
        Alert.alert('Hata', 'Bu karakter zaten listenizde var.');
        return;
    }

    const newList = [...characterList, characterName.trim()];
    setCharacterList(newList);
    await AsyncStorage.setItem('my_characters', JSON.stringify(newList));
    setCharacterName('');
  };

  const removeCharacter = async (nameToDelete: string) => {
    Alert.alert('Sil', `${nameToDelete} karakterini listeden silmek istiyor musun?`, [
        { text: 'Vazgeç', style: 'cancel' },
        { 
            text: 'Sil', 
            style: 'destructive',
            onPress: async () => {
                const newList = characterList.filter(name => name !== nameToDelete);
                setCharacterList(newList);
                await AsyncStorage.setItem('my_characters', JSON.stringify(newList));
            }
        }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Takip etmek istediğin karakterleri buraya ekle. Günlük listede bunlar çıkacak.</Text>

      {/* EKLEME ALANI */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Karakter Adı (Örn: Ninja01)"
          value={characterName}
          onChangeText={setCharacterName}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* LİSTE */}
      <FlatList
        data={characterList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => removeCharacter(item)}>
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Henüz karakter eklemedin.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F7FB' },
  infoText: { color: '#666', marginBottom: 20, fontSize: 14 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, height: 50, marginRight: 10, borderWidth: 1, borderColor: '#DDD' },
  addButton: { width: 50, height: 50, backgroundColor: '#4A90E2', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EBF3FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#4A90E2', fontWeight: 'bold' },
  itemText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});