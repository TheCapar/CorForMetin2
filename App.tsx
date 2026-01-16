import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// LoginScreen gitti, SplashScreen geldi
import AddCharacterScreen from './src/screens/AddCharacterScreen';
import CharacterListScreen from './src/screens/CharacterListScreen';
import HomeScreen from './src/screens/HomeScreen';
import MonthlyStatsScreen from './src/screens/MonthlyStatsScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash" // Açılış sayfamız Splash
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                    name="CharacterList"
                    component={CharacterListScreen}
                    options={{ title: 'Günlük Yoklama', headerShown: true }} // Header görünsün ki geri dönebilsin
                />
                <Stack.Screen
                    name="AddCharacter"
                    component={AddCharacterScreen}
                    options={{ title: 'Karakter Ekle', headerShown: true }} // Header görünsün ki geri dönebilsin
                />
                <Stack.Screen
                    name="MounthlyStats"
                    component={MonthlyStatsScreen}
                    options={{ title: 'Aylık Rapor', headerShown: true }} // Header görünsün ki geri dönebilsin
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}