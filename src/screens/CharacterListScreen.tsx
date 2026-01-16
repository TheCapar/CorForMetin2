// screens/DailyCheckScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Check, ChevronLeft, ChevronRight, Gem, Save, Shield, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface DailyState {
    name: string;
    corGiven: boolean | null;
    guildDonation: boolean | null;
}

export default function DailyCheckScreen() {
    const navigation = useNavigation<any>();

    // Seçili tarihi tutan state (Başlangıç: Bugün)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyList, setDailyList] = useState<DailyState[]>([]);

    // Tarih değiştiğinde veya ekran odaklandığında veriyi çek
    useFocusEffect(
        useCallback(() => {
            loadDailyStatus(selectedDate);
        }, [selectedDate]) // selectedDate değişince tetiklenir
    );

    // Helper: Date objesini YYYY-MM-DD stringine çevirir
    const getFormattedDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Tarih değiştirme fonksiyonu
    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);

        // Geleceğe gitmeyi engelleyelim (Opsiyonel: İstersen bu kontrolü kaldırabilirsin)
        if (newDate > new Date()) return;

        setSelectedDate(newDate);
    };

    const loadDailyStatus = async (dateParam: Date) => {
        try {
            const masterListRaw = await AsyncStorage.getItem('my_characters');
            const masterList: string[] = masterListRaw ? JSON.parse(masterListRaw) : [];

            if (masterList.length === 0) {
                Alert.alert('Karakter Yok', 'Önce karakter eklemelisin.');
                navigation.goBack();
                return;
            }

            const logsRaw = await AsyncStorage.getItem('character_logs');
            const allLogs = logsRaw ? JSON.parse(logsRaw) : [];

            // Parametre olarak gelen tarihin string hali
            const targetDateStr = getFormattedDate(dateParam);

            const mergedList = masterList.map(charName => {
                // Hedef tarihe ve isme göre log ara
                const foundLog = allLogs.find((log: any) =>
                    log.name === charName && log.date.split('T')[0] === targetDateStr
                );

                return {
                    name: charName,
                    corGiven: foundLog ? foundLog.corGiven : null,
                    guildDonation: foundLog ? foundLog.guildDonation : null
                };
            });

            setDailyList(mergedList);

        } catch (e) { console.error(e); }
    };

    const toggleStatus = (index: number, field: 'corGiven' | 'guildDonation', value: boolean) => {
        const newList = [...dailyList];
        if (newList[index][field] === value) {
            newList[index][field] = null;
        } else {
            newList[index][field] = value;
        }
        setDailyList(newList);
    };

    const saveAll = async () => {
        try {
            const incomplete = dailyList.some(item => item.corGiven === null || item.guildDonation === null);
            if (incomplete) {
                Alert.alert('Eksik Var', 'Lütfen tüm seçimleri yap.');
                return;
            }

            const logsRaw = await AsyncStorage.getItem('character_logs');
            let allLogs = logsRaw ? JSON.parse(logsRaw) : [];

            // Şu an ekranda hangi tarih seçiliyse ona kaydediyoruz
            const targetDateStr = getFormattedDate(selectedDate);

            // O günün eski kayıtlarını temizle (Overwrite)
            allLogs = allLogs.filter((log: any) => {
                const logDate = log.date.split('T')[0];
                const isTargetDay = logDate === targetDateStr;
                const isInMyList = dailyList.some(d => d.name === log.name);
                return !(isTargetDay && isInMyList);
            });

            // Yeni kayıtları oluştur (Tarih olarak seçili tarihi veriyoruz)
            const newLogs = dailyList.map(item => ({
                id: Date.now() + Math.random().toString(),
                name: item.name,
                corGiven: item.corGiven,
                guildDonation: item.guildDonation,
                date: selectedDate.toISOString() // Seçili tarih
            }));

            const finalLogs = [...allLogs, ...newLogs];
            await AsyncStorage.setItem('character_logs', JSON.stringify(finalLogs));

            Alert.alert('Kaydedildi', `${targetDateStr} tarihi için kayıtlar güncellendi.`);

        } catch (e) { console.error(e); }
    };

    const renderItem = ({ item, index }: { item: DailyState, index: number }) => (
        <View style={styles.card}>
            <View style={styles.nameSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.charName}>{item.name}</Text>
            </View>

            <View style={styles.actionsSection}>
                {/* COR */}
                <View style={styles.actionCol}>
                    <View style={styles.labelContainer}>
                        <Gem size={12} color="#888" />
                        <Text style={styles.actionLabel}>Cor</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.miniBtn, item.corGiven === true && styles.btnGreen]}
                            onPress={() => toggleStatus(index, 'corGiven', true)}
                        >
                            <Check size={16} color={item.corGiven === true ? "#FFF" : "#CCC"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.miniBtn, item.corGiven === false && styles.btnRed]}
                            onPress={() => toggleStatus(index, 'corGiven', false)}
                        >
                            <X size={16} color={item.corGiven === false ? "#FFF" : "#CCC"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LONCA */}
                <View style={styles.actionCol}>
                    <View style={styles.labelContainer}>
                        <Shield size={12} color="#888" />
                        <Text style={styles.actionLabel}>Lonca</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.miniBtn, item.guildDonation === true && styles.btnGreen]}
                            onPress={() => toggleStatus(index, 'guildDonation', true)}
                        >
                            <Check size={16} color={item.guildDonation === true ? "#FFF" : "#CCC"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.miniBtn, item.guildDonation === false && styles.btnRed]}
                            onPress={() => toggleStatus(index, 'guildDonation', false)}
                        >
                            <X size={16} color={item.guildDonation === false ? "#FFF" : "#CCC"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    // Bugün mü kontrolü (Sağ oku pasif yapmak için)
    const isToday = getFormattedDate(selectedDate) === getFormattedDate(new Date());

    return (
        <View style={styles.container}>

            {/* TARİH DEĞİŞTİRİCİ */}
            < View style={styles.dateControlBar} >
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => changeDate(-1)}
                >
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.dateDisplay}>
                    <Text style={styles.dateText}>
                        {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                    <Text style={styles.dayName}>
                        {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long' })}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.arrowButton, isToday && styles.disabledArrow]}
                    onPress={() => changeDate(1)}
                    disabled={isToday}
                >
                    <ChevronRight size={24} color={isToday ? "#EEE" : "#333"} />
                </TouchableOpacity>
            </View >

            <FlatList
                data={dailyList}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={saveAll}>
                    <Text style={styles.saveText}>Kaydet ({getFormattedDate(selectedDate)})</Text>
                    <Save size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F7FB' },
    // TARİH STİLLERİ
    dateControlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    dateDisplay: {
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dayName: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    arrowButton: {
        padding: 10,
        backgroundColor: '#F5F7FA',
        borderRadius: 8,
    },
    disabledArrow: {
        opacity: 0.5,
    },

    // KART STİLLERİ
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    nameSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EBF3FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    avatarText: { color: '#4A90E2', fontWeight: 'bold' },
    charName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    actionsSection: { flexDirection: 'row' },
    actionCol: { alignItems: 'center', marginLeft: 12 },
    labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 4 },
    actionLabel: { fontSize: 11, color: '#888', fontWeight: '600' },
    buttonGroup: { flexDirection: 'row', gap: 4 },
    miniBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
    btnGreen: { backgroundColor: '#4CAF50' },
    btnRed: { backgroundColor: '#F44336' },

    // FOOTER
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        alignItems: 'center'
    },
    saveButton: {
        backgroundColor: '#2196F3',
        width: '100%',
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginRight: 10 }
});