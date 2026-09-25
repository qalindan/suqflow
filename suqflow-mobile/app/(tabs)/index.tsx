import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useCartStore } from '../../store/useCartStore';

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Omo Detergent', price: 45.00 },
  { id: '2', name: 'Coca-Cola (500ml)', price: 35.00 },
  { id: '3', name: 'Teff (1kg)', price: 120.00 },
  { id: '4', name: 'Shiro Powder', price: 80.00 },
  { id: '5', name: 'Cooking Oil (1L)', price: 350.00 },
  { id: '6', name: 'Coffee Beans', price: 400.00 },
];

export default function POSGridScreen() {
  const addItem = useCartStore(state => state.addItem);
  const totalAmount = useCartStore(state => state.totalAmount);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>POS Grid</Text>
      
      <FlatList
        data={DUMMY_PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => addItem({ id: item.id, name: item.name, price: item.price })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>ETB {item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Due:</Text>
          <Text style={styles.totalAmount}>ETB {totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1E1E1E',
    width: '48%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardPrice: {
    color: '#AAD471',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1B1B',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#A1A1AA',
    fontSize: 18,
  },
  totalAmount: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    backgroundColor: '#4A7C2A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
