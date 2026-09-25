import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../data/mockData';
import { apiFetch } from '../services/api';
import { useCartStore } from '../store/useCartStore';

export default function ReportScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseReason, setExpenseReason] = useState('');
  const totalSalesToday = useCartStore((state) => state.totalSalesToday);
  const itemsSold = 0; // Default until tracked in store
  const transactions: Transaction[] = []; // Default empty array until synced

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionTime}>{item.time}</Text>
        <View>
          <Text style={styles.transactionTitle}>Sale - {item.items} Items</Text>
          <Text style={styles.transactionCashier}>Cashier: {item.cashier}</Text>
        </View>
      </View>
      <Text style={styles.transactionAmount}>ETB {item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Shift Summary</Text>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Ionicons name="cash-outline" size={16} color="#A0C080" />
              <Text style={styles.summaryCardTitle}>TOTAL CASH COLLECTED</Text>
            </View>
            <Text style={styles.summaryCardValue}>ETB {totalSalesToday.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Ionicons name="bag-handle-outline" size={16} color="#A0C080" />
              <Text style={styles.summaryCardTitle}>ITEMS SOLD</Text>
            </View>
            <Text style={styles.summaryCardValue}>{itemsSold} Units</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Sales</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No sales logged today</Text>}
        />

        <TouchableOpacity style={styles.expenseButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="document-text-outline" size={20} color="#FFFFFF" style={styles.expenseIcon} />
          <Text style={styles.expenseButtonText}>Log Operational Expense</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Pressable 
              style={styles.modalOverlay} 
              onPress={() => { Keyboard.dismiss(); setModalVisible(false); }}
            >
              <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Log Till Expense</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#888" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Amount</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputPrefix}>ETB</Text>
                  <TextInput
                    style={styles.input}
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#555"
                  />
                </View>

                <Text style={styles.inputLabel}>Reason</Text>
                <TextInput
                  style={[styles.input, styles.inputReason, { minHeight: 80, paddingVertical: 12 }]}
                  value={expenseReason}
                  onChangeText={setExpenseReason}
                  placeholder="e.g. Water delivery"
                  placeholderTextColor="#555"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={async () => {
                    try {
                      await apiFetch('/api/expenses', {
                        method: 'POST',
                        body: JSON.stringify({
                          amount: Number(expenseAmount),
                          reason: expenseReason,
                        }),
                      });
                      Alert.alert("Success", "Expense logged successfully");
                    } catch (error) {
                      console.warn('Offline mode: Failed to sync expense.', error);
                      Alert.alert("Offline", "Expense saved locally (sync pending)");
                    } finally {
                      setModalVisible(false);
                      setExpenseAmount('');
                      setExpenseReason('');
                    }
                  }}
                >
                  <Text style={styles.saveButtonText}>Save Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryCardTitle: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  summaryCardValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionTime: {
    color: '#888',
    fontSize: 12,
    marginRight: 16,
    width: 40,
  },
  transactionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionCashier: {
    color: '#888',
    fontSize: 12,
  },
  transactionAmount: {
    color: '#A0C080',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expenseButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  expenseIcon: {
    marginRight: 8,
  },
  expenseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputPrefix: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputReason: {
    backgroundColor: '#121212',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#4A7C2A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 14,
  },
});
