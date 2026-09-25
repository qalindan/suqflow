import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiFetch } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../components/Toast';

export default function AddCustomerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Neighbor');
  const [hasTab, setHasTab] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleSaveCustomer = async () => {
    if (!name || !phone) {
      showToast('Full Name and Phone Number are required.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        name,
        phone,
        category,
        balance: 0, 
        notes,
      };

      const response = await apiFetch('/api/customers', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create customer');
      
      showToast('Customer profile created successfully!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.warn('Network error saving customer', error);
      showToast('Failed to save customer. Are you online?', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoBanner}>
          <View style={styles.infoIconBox}>
            <Ionicons name="person" size={16} color="#AAD471" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Customer Tab Profile</Text>
            <Text style={styles.infoDesc}>Enables credit (ILG), receipts & loyalty</Text>
          </View>
        </View>

        <Text style={styles.label}>FULL NAME *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={16} color="#A1A1AA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Ato Girma Tadesse"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={styles.label}>PHONE NUMBER *</Text>
        <View style={styles.phoneWrapper}>
          <View style={styles.phonePrefix}>
            <Text style={styles.phonePrefixText}>ET +251</Text>
          </View>
          <View style={styles.phoneInputBox}>
            <Ionicons name="call-outline" size={16} color="#A1A1AA" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="911 234 567"
              placeholderTextColor="#555"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>
        <Text style={styles.helpText}>Required for SMS ledger updates & fast search</Text>

        <Text style={styles.label}>CUSTOMER CATEGORY</Text>
        <View style={styles.categoryRow}>
          <TouchableOpacity 
            style={[styles.categoryBtn, category === 'Neighbor' && styles.categoryBtnActive]}
            onPress={() => setCategory('Neighbor')}
          >
            <Ionicons name="home-outline" size={14} color={category === 'Neighbor' ? '#FFFFFF' : '#A1A1AA'} />
            <Text style={[styles.categoryText, category === 'Neighbor' && styles.categoryTextActive]}>Neighbor</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryBtn, category === 'Wholesale' && styles.categoryBtnActive]}
            onPress={() => setCategory('Wholesale')}
          >
            <Text style={[styles.categoryText, category === 'Wholesale' && styles.categoryTextActive]}>Wholesale</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryBtn, category === 'Walk-in' && styles.categoryBtnActive]}
            onPress={() => setCategory('Walk-in')}
          >
            <Ionicons name="walk-outline" size={14} color={category === 'Walk-in' ? '#FFFFFF' : '#A1A1AA'} />
            <Text style={[styles.categoryText, category === 'Walk-in' && styles.categoryTextActive]}>Walk-in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleHeader}>
            <View style={styles.toggleIconBox}>
              <Ionicons name="document-text-outline" size={16} color="#AAD471" />
            </View>
            <View style={styles.toggleTextContent}>
              <Text style={styles.toggleTitle}>Initial Balance / Credit (Log)</Text>
              <Text style={styles.toggleDesc}>Manage existing tabs or debt limits</Text>
            </View>
          </View>
          
          <View style={styles.toggleRow}>
            <TouchableOpacity 
              style={[styles.toggleOption, !hasTab && styles.toggleOptionActive]}
              onPress={() => setHasTab(false)}
            >
              <Ionicons name="ban-outline" size={14} color={!hasTab ? '#FFFFFF' : '#A1A1AA'} />
              <Text style={[styles.toggleOptionText, !hasTab && styles.toggleOptionTextActive]}>Zero Tab (ETB 0)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleOption, hasTab && styles.toggleOptionActive]}
              onPress={() => setHasTab(true)}
            >
              <Text style={[styles.toggleOptionText, hasTab && styles.toggleOptionTextActive]}>Existing Tab</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>HOUSE / LANDMARK / NOTES (OPTIONAL)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={16} color="#A1A1AA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Kebele 04, Next to Fresh Bakery"
            placeholderTextColor="#555"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveSelectBtn} 
            onPress={handleSaveCustomer}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" style={styles.btnIcon} />
            )}
            <Text style={styles.saveSelectBtnText}>
              {isSubmitting ? 'Saving...' : 'Save & Select Customer'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveOnlyBtn}
            onPress={handleSaveCustomer}
            disabled={isSubmitting}
          >
            <Ionicons name="person-add-outline" size={16} color="#A1A1AA" style={styles.btnIcon} />
            <Text style={styles.saveOnlyBtnText}>Save Customer Only</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1B1B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 124, 42, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDesc: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  label: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 14,
  },
  phoneWrapper: {
    flexDirection: 'row',
  },
  phonePrefix: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  phonePrefixText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  phoneInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  helpText: {
    color: '#A1A1AA',
    fontSize: 10,
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  categoryBtnActive: {
    backgroundColor: '#4A7C2A',
    borderColor: '#4A7C2A',
  },
  categoryText: {
    color: '#A1A1AA',
    fontSize: 12,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  toggleCard: {
    backgroundColor: '#1C1B1B',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 124, 42, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleTextContent: {
    flex: 1,
  },
  toggleTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toggleDesc: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#131313',
    borderRadius: 8,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleOptionActive: {
    backgroundColor: '#2A2A2A',
  },
  toggleOptionText: {
    color: '#A1A1AA',
    fontSize: 12,
    marginLeft: 6,
  },
  toggleOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
  },
  saveSelectBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A7C2A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnIcon: {
    marginRight: 8,
  },
  saveSelectBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveOnlyBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveOnlyBtnText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
