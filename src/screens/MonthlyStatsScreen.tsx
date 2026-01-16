// screens/MonthlyStatsScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Gem, TrendingUp, Trophy } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CharacterStat {
    name: string;
    count: number;
}

export default function MonthlyStatsScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [totalCors, setTotalCors] = useState(0);
    const [charStats, setCharStats] = useState<CharacterStat[]>([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            calculateMonthlyStats();
        }, [currentDate]) // Ay değişince tekrar hesapla
    );

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const calculateMonthlyStats = async () => {
        setLoading(true);
        try {
            const logsRaw = await AsyncStorage.getItem('character_logs');
            const allLogs = logsRaw ? JSON.parse(logsRaw) : [];

            // Seçili ayın başlangıç ve bitiş tarihlerini belirle
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            // Ayın 1'i
            const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
            // Bir sonraki ayın 0. günü (yani bu ayın son günü)
            const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];

            let monthlyTotal = 0;
            const statsMap: { [key: string]: number } = {};

            allLogs.forEach((log: any) => {
                // Log tarihini sadece YYYY-MM-DD olarak alalım
                const logDateStr = log.date.split('T')[0];

                // Tarih aralığında mı ve Cor alınmış mı?
                if (logDateStr >= startOfMonth && logDateStr <= endOfMonth && log.corGiven === true) {
                    monthlyTotal++;

                    // Karakter bazlı sayım
                    if (statsMap[log.name]) {
                        statsMap[log.name]++;
                    } else {
                        statsMap[log.name] = 1;
                    }
                }
            });

            // Map'i listeye çevirip çoktan aza sıralayalım
            const sortedStats = Object.keys(statsMap)
                .map(name => ({ name, count: statsMap[name] }))
                .sort((a, b) => b.count - a.count);

            setTotalCors(monthlyTotal);
            setCharStats(sortedStats);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: { item: CharacterStat, index: number }) => (
        <View style={styles.statRow}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.charInfo}>
                <Text style={styles.charName}>{item.name}</Text>
                {/* İlerleme çubuğu (Görsel şov) */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(item.count / totalCors) * 100}%` }]} />
                </View>
            </View>
            <View style={styles.countBadge}>
                <Text style={styles.countText}>{item.count}</Text>
                <Gem size={12} color="#4A90E2" />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            {/* AY SEÇİCİ */}
            <View style={styles.monthSelector}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                    <ChevronLeft color="#333" size={24} />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.monthText}>
                        {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </Text>
                    <Text style={styles.subText}>Dönem Özeti</Text>
                </View>

                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                    <ChevronRight color="#333" size={24} />
                </TouchableOpacity>
            </View>

            {/* TOPLAM KART (HIGHLIGHT) */}
            <View style={styles.totalCard}>
                <View>
                    <Text style={styles.totalLabel}>Toplam Cor</Text>
                    <Text style={styles.totalNumber}>{totalCors}</Text>
                </View>
                <View style={styles.iconCircle}>
                    <Trophy size={32} color="#FFD700" />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Karakter Performansları</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={charStats}
                    renderItem={renderItem}
                    keyExtractor={item => item.name}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <TrendingUp size={48} color="#DDD" />
                            <Text style={styles.emptyText}>Bu ay henüz kayıt yok.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F7FB' },

    // AY SEÇİCİ
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    arrowBtn: {
        padding: 10,
        backgroundColor: '#F5F7FA',
        borderRadius: 8,
    },
    monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'capitalize',
    },
    subText: {
        fontSize: 12,
        color: '#888',
    },

    // TOPLAM KART
    totalCard: {
        backgroundColor: '#4A90E2', // Mavi tema
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        elevation: 4,
        shadowColor: "#4A90E2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    totalLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    totalNumber: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // LİSTE
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        marginLeft: 4,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
    },
    rankBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    charInfo: {
        flex: 1,
    },
    charName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        width: '90%',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 2,
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBF3FF',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        gap: 4,
    },
    countText: {
        fontWeight: 'bold',
        color: '#4A90E2',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        marginTop: 10,
        color: '#AAA',
        fontSize: 14,
    }
});