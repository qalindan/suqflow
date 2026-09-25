import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { useCartStore } from '../store/useCartStore';

interface SideMenuProps {
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function SideMenu({ onClose }: SideMenuProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const totalSalesToday = useCartStore((state) => state.totalSalesToday);
  const expectedCashInDrawer = useCartStore((state) => state.expectedCashInDrawer);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <SafeAreaView style={styles.menuContainer}>
        <View style={styles.header}>
          <View style={styles.cashierInfo}>
            <View style={styles.avatar}>
              <View style={styles.avatarInner} />
            </View>
            <View>
              <Text style={styles.cashierLabel}>Cashier:</Text>
              <Text style={styles.cashierName}>Kalkidan</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>TOTAL SALES TODAY</Text>
          <Text style={styles.statsValueMain}>ETB {totalSalesToday.toFixed(2)}</Text>

          <View style={styles.statsRow}>
            <Ionicons name="wallet-outline" size={14} color="#AAD471" />
            <Text style={styles.statsLabelGreen}>EXPECTED CASH IN DRAWER</Text>
          </View>
          <Text style={styles.statsValueGreen}>ETB {expectedCashInDrawer.toFixed(2)}</Text>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TRANSACTIONS</Text>
            <Text style={styles.metricValue}>0</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>RETURNS</Text>
            <Text style={styles.metricValue}>ETB 0.00</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          style={styles.logExpenseBtn}
          onPress={() => {
            onClose();
            navigation.navigate('Main', { screen: 'Report' } as any); // Or just Report if standard stack
          }}
        >
          <Ionicons name="document-text-outline" size={16} color="#A1A1AA" />
          <Text style={styles.logExpenseText}>LOG EXPENSE</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  menuContainer: {
    width: '75%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#131313',
    padding: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#2A2A2A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cashierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#AAD471',
  },
  cashierLabel: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  cashierName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginBottom: 24,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsValueMain: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsLabelGreen: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  statsValueGreen: {
    color: '#AAD471',
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#1C1B1B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  metricLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logExpenseBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 20,
  },
  logExpenseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
