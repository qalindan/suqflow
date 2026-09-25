import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiFetch } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertModal from '../components/CustomAlertModal';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info'>('info');

  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert("Error", "Please enter both your Cashier ID and PIN.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { user_id: username, pin_code: password };
      console.log('Login Payload:', payload);
      
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log('Login Response:', data);
      
      if (data.token || data.success) {
        // Handle token storage or auth state if provided, otherwise assume success sets a cookie (if web) or handles it in api proxy
        // Since it's mobile, we need token based auth.
        // wait, the backend returns { success: true, role: user.role }
        // the app just relied on data.token existing to set AsyncStorage, but now just proceed if success
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }
        navigation.replace('Main', { screen: 'Catalog' });
      } else {
        showAlert("Error", "Login failed. Please check credentials.", "error");
      }
    } catch (error: any) {
      console.log('Login Error Response:', error);
      showAlert("Error", "Invalid credentials. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.pressableArea} 
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.mainContainer}>
            <View style={styles.inner}>
              
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
                <Text style={styles.title}>SUQFlow</Text>
                <Text style={styles.subtitle}>Welcome Back!!</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#A0C080"
                  autoCapitalize="none"
                />
                
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#A0C080"
                  secureTextEntry
                />

                <TouchableOpacity 
                  style={[styles.button, isLoading && { opacity: 0.7 }]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#4A7C2A" />
                  ) : (
                    <Text style={styles.buttonText}>Log in</Text>
                  )}
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlertModal 
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4F1E1',
  },
  keyboardView: {
    flex: 1,
  },
  pressableArea: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#4A7C2A',
    borderRadius: 40,
    padding: 24,
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 14,
    width: 140,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#4A7C2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
