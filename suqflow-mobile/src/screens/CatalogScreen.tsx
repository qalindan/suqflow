import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';

import SideMenu from '../components/SideMenu';
import CartBottomSheet from '../components/CartBottomSheet';
import CheckoutModal from '../components/CheckoutModal';
import Toast from '../components/Toast';
import { apiFetch } from '../services/api';

export default function CatalogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // UI State
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Global Cart State
  const cart = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItem);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiFetch('/api/inventory');
        const data = await response.json();
        
        // Map backend schema (retail_price, current_stock) to mobile app schema (price, currentStock)
        const mappedData = data.map((item: any) => ({
          ...item,
          price: item.retail_price !== undefined ? item.retail_price : item.price,
          currentStock: item.current_stock !== undefined ? item.current_stock : item.currentStock
        }));
        
        setProducts(mappedData);
      } catch (error) {
        console.warn('Network error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const completeCheckout = useCartStore((state) => state.completeCheckout);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const dynamicCategories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setToastMessage('Sale Successful');
  };

  const handleAddTab = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    navigation.navigate('CustomerList');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => addItem(item)}>
      <View style={styles.imageFallback}>
        <Text style={styles.imageFallbackText}>{item.name.substring(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>ETB {item.price.toFixed(2)}</Text>
          <Text style={styles.stockText}>{item.currentStock} in stock</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sale Management</Text>
          <TouchableOpacity onPress={() => setIsSideMenuOpen(true)}>
            <Ionicons name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { outlineStyle: 'none' } as any]}
            placeholder="Search items..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.categoriesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {dynamicCategories.map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryPill, activeCategory === category && styles.categoryPillActive]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.categoryText, activeCategory === category && styles.categoryTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A7C2A" />
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.productRow}
          />
        )}

        {cart.length > 0 && (
          <TouchableOpacity style={styles.floatingCart} onPress={() => setIsCartOpen(true)}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Text>
            </View>
            <Text style={styles.cartTotalText}>View Order: ETB {cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSideMenuOpen && <SideMenu onClose={() => setIsSideMenuOpen(false)} />}
      
      <CartBottomSheet 
        visible={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        visible={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirmCash={handleCheckoutComplete}
        onAddTab={handleAddTab}
      />

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
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  categoriesWrapper: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 12,
  },
  categoryPillActive: {
    backgroundColor: '#4A7C2A',
    borderColor: '#4A7C2A',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  productList: {
    paddingBottom: 80,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageFallback: {
    height: 120,
    backgroundColor: '#4A7C2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFallbackText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockText: {
    color: '#A1A1AA',
    fontSize: 10,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#4A7C2A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  cartBadgeText: {
    color: '#4A7C2A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartTotalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
