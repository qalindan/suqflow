import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../store/useCartStore';
import { apiFetch } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const clearCart = useCartStore(state => state.clearCart);
  
  // Local state fallbacks until global auth store is wired
  const [cashierName, setCashierName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiFetch('/api/auth/me', { headers });
        const data = await response.json();
        
        // Assuming the backend returns something like { user: { name: '...', staffId: '...' } }
        // We'll optimistically try to extract common properties
        if (data && (data.name || (data.user && data.user.name))) {
           setCashierName(data.name || data.user.name);
           setStaffId(data.staffId || (data.user && data.user.staffId) || data.id || 'Pending');
        }
      } catch (error) {
        console.warn('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "End Shift",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: () => {
            clearCart();
            navigation.replace('Auth');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting</Text>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={16} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pageTitleContainer}>
          <View>
            <Text style={styles.pageTitle}>Cashier Settings</Text>
            <Text style={styles.pageSubtitle}>Active Session • Cashier</Text>
            <Text style={styles.pageSubtitle}>{cashierName || 'Loading...'}</Text>
          </View>
          <View style={styles.syncBadge}>
            <View style={styles.dot} />
            <Text style={styles.syncText}>Offline Sync Ready</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBackground}>
                <Ionicons name="id-card-outline" size={24} color="#AAD471" />
              </View>
              <View style={styles.avatarCheck}>
                <Ionicons name="checkmark-circle" size={16} color="#AAD471" />
              </View>
            </View>
            <View style={styles.userInfo}>
              {loading ? (
                <ActivityIndicator size="small" color="#AAD471" />
              ) : (
                <>
                  <Text style={styles.userName}>{cashierName || 'Active Cashier'}</Text>
                  <Text style={styles.userId}>Staff ID: {staffId || 'Pending'}</Text>
                </>
              )}
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <View style={styles.labelRow}>
                <Ionicons name="time-outline" size={14} color="#A1A1AA" />
                <Text style={styles.gridLabel}>Shift Logged</Text>
              </View>
              <Text style={styles.gridValue}>08:30 AM</Text>
              <Text style={styles.gridSub}>Current Session</Text>
            </View>
            <View style={styles.gridCol}>
              <View style={styles.labelRow}>
                <Ionicons name="timer-outline" size={14} color="#AAD471" />
                <Text style={styles.gridLabel}>Duration</Text>
              </View>
              <Text style={[styles.gridValue, { color: '#AAD471' }]}>Active 5h 42m</Text>
              <Text style={styles.gridSub}>Continuous login</Text>
            </View>
          </View>

          <View style={[styles.gridRow, { marginTop: 24 }]}>
            <View style={styles.gridCol}>
              <View style={styles.labelRow}>
                <Ionicons name="hardware-chip-outline" size={14} color="#A1A1AA" />
                <Text style={styles.gridLabel}>POS Device</Text>
              </View>
              <Text style={styles.gridValue}>Current Device</Text>
              <Text style={styles.gridSub}>SUQFlow Mobile v2.4</Text>
            </View>
            <View style={styles.gridCol}>
              <View style={styles.labelRow}>
                <View style={styles.dot} />
                <Text style={styles.gridLabel}>Ready</Text>
              </View>
              <Text style={styles.gridValue}>Device ID: POS-TAB-09</Text>
              <Text style={styles.gridSub}>Offline Sync Ready</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Log Out (End Shift)</Text>
        </TouchableOpacity>
        <Text style={styles.logoutSub}>
          Ends active till session & triggers cash reconciliation
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#131313',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A7C2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#C4C9B6',
    marginBottom: 2,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1B1B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#AAD471',
    marginRight: 6,
  },
  syncText: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  card: {
    backgroundColor: '#1C1B1B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatarBackground: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCheck: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1C1B1B',
    borderRadius: 10,
    padding: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userId: {
    fontSize: 13,
    color: '#A1A1AA',
  },
  activeBadge: {
    backgroundColor: 'rgba(74, 124, 42, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A7C2A',
  },
  activeBadgeText: {
    color: '#AAD471',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCol: {
    flex: 1,
    paddingRight: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    marginLeft: 6,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gridSub: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoutSub: {
    textAlign: 'center',
    color: '#A1A1AA',
    fontSize: 12,
  },
});
