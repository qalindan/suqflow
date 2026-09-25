import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Customer } from '../data/mockData';
import { apiFetch } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from '../store/useCartStore';
import Toast from '../components/Toast';

export default function CustomerListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleTabAddition = async () => {
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        amount: cartTotal,
        payment_method: 'CREDIT',
        customer_id: selectedCustomer.id,
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
      };

      await apiFetch('/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      clearCart();
      setSelectedCustomer(null);
      setToastMessage('Added to Tab Successfully!');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.warn('Transaction failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await apiFetch('/api/customers', { headers });
      const data = await response.json();
      
      const mappedCustomers = (Array.isArray(data) ? data : []).map((customer: any) => ({
        ...customer,
        balance: customer.debt_balance !== undefined ? customer.debt_balance : customer.balance
      }));
      
      setCustomers(mappedCustomers);
    } catch (error) {
      console.warn('Failed to fetch customers', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [])
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.phone && c.phone.includes(searchQuery))
  );

  const renderCustomer = ({ item }: { item: Customer }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => setSelectedCustomer(item)}
    >
      <View>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={[
          styles.balanceValue,
          item.balance < 0 ? styles.negativeBalance : styles.positiveBalance
        ]}>
          {item.balance < 0 ? `- ETB ${Math.abs(item.balance).toFixed(2)}` : `ETB ${item.balance.toFixed(2)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Customer</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddCustomer')} style={styles.newBtn}>
          <Text style={styles.newBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or phone..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#AAD471" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredCustomers}
            renderItem={renderCustomer}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                fetchCustomers();
              }} tintColor="#AAD471" />
            }
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No customers found</Text>}
          />
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedCustomer}
        onRequestClose={() => setSelectedCustomer(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSelectedCustomer(null)} activeOpacity={1} />
          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <Text style={styles.confirmText}>
              Add ETB {cartTotal.toFixed(2)} to {selectedCustomer?.name}'s Tab?
            </Text>
            
            <TouchableOpacity 
              style={[styles.confirmBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleTabAddition}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Tab Addition</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={() => setSelectedCustomer(null)}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast 
        visible={!!toastMessage} 
        message={toastMessage} 
        onHide={() => setToastMessage('')} 
      />
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
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newBtn: {
    padding: 4,
  },
  newBtnText: {
    color: '#AAD471',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    margin: 16,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  customerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  customerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerPhone: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#A1A1AA',
  },
  negativeBalance: {
    color: '#FF6B6B',
  },
  separator: {
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmBtn: {
    backgroundColor: '#4A7C2A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
