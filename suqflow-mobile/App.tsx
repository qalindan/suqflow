import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './src/types/navigation';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainTabs from './src/navigation/MainTabs';
import CustomerListScreen from './src/screens/CustomerListScreen';
import AddCustomerScreen from './src/screens/AddCustomerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen} 
            options={{ 
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="CustomerList" component={CustomerListScreen} />
          <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
