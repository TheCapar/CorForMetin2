// SplashScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface SplashScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: SplashScreenProps) {
  // Animasyon Değerleri
  const opacityAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.5);
  const textTranslateY = useSharedValue(50);

  useEffect(() => {
    // 1. Animasyonları Başlat
    opacityAnim.value = withTiming(1, { duration: 1000 });
    scaleAnim.value = withSpring(1, { damping: 10 });
    textTranslateY.value = withDelay(300, withSpring(0));

    // 2. Bekle ve Ana Sayfaya Git (2.5 saniye sonra)
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer); // Ekran kapanırsa sayacı temizle
  }, []);

  // Animasyon Stilleri
  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Arka plan süsü (Opsiyonel daireler) */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.content}>
        {/* LOGO */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Ionicons name="game-controller" size={80} color="#FFF" />
        </Animated.View>

        {/* YAZILAR */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.title}>Tık Tık Hesap Takip Sistemi</Text>
          <Text style={styles.subtitle}>Corlarını Takip Etmeyi Unutma</Text>
        </Animated.View>
      </View>

      {/* Alt tarafta yükleniyor yazısı */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>v1.0.0 • Powered by Edêbali</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2', // Ana tema rengimiz
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  versionText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  // Arka plan dekoratif daireler
  circle1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});