import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { apiFetch } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmCash: () => void;
  onAddTab: () => void;
}

export default function CheckoutModal({ visible, onClose, onConfirmCash, onAddTab }: CheckoutModalProps) {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCashConfirm = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        amount: total,
        payment_method: 'CASH',
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
      };

      await apiFetch('/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      clearCart();
      onConfirmCash();
    } catch (error) {
      console.warn('Transaction failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.totalLabel}>Total Due</Text>
          <Text style={styles.totalValue}>ETB {total.toFixed(2)}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.confirmBtn, isLoading && { opacity: 0.7 }]} 
              onPress={handleCashConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Cash Received</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.tabBtn} onPress={onAddTab}>
              <Text style={styles.tabBtnText}>Add to Customers Tab</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.backBtn} onPress={onClose}>
              <Text style={styles.backBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#131313',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    alignItems: 'center',
  },
  totalLabel: {
    color: '#A1A1AA',
    fontSize: 16,
    marginBottom: 8,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
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
  tabBtn: {
    backgroundColor: '#1C1B1B',
    borderWidth: 1,
    borderColor: '#4A7C2A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  tabBtnText: {
    color: '#AAD471',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
});
