import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeownerRequest'>;

interface FormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  equipmentDescription: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function HomeownerRequest({ navigation }: Props) {
  const [form, setForm] = useState<FormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    equipmentDescription: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert('Validation Error', 'Please enter the homeowner name.');
      return false;
    }
    if (!form.address.trim()) {
      Alert.alert('Validation Error', 'Please enter the property address.');
      return false;
    }
    if (!form.phone.trim()) {
      Alert.alert('Validation Error', 'Please enter a phone number.');
      return false;
    }
    if (!form.equipmentDescription.trim()) {
      Alert.alert('Validation Error', 'Please describe the equipment to remove.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStatus('submitting');

    try {
      const res = await fetch('/api/requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeowner_name: form.name,
          address: form.address,
          phone: form.phone,
          email: form.email,
          description: form.equipmentDescription,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Request Submitted!</Text>
        <Text style={styles.successMessage}>
          The removal request for {form.address} has been submitted. The
          homeowner will receive a confirmation and scheduling details.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>New Removal Request</Text>
        <Text style={styles.description}>
          Enter the homeowner's details and equipment information to schedule a
          satellite dish removal and recycling service.
        </Text>

        {status === 'error' && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              ⚠️ Submission failed. Please check your connection and try again.
            </Text>
          </View>
        )}

        <Text style={styles.label}>Homeowner Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Jane Doe"
          value={form.name}
          onChangeText={(v) => updateField('name', v)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Property Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 123 Elm Street, Springfield, IL"
          value={form.address}
          onChangeText={(v) => updateField('address', v)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. (555) 123-4567"
          value={form.phone}
          onChangeText={(v) => updateField('phone', v)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. jane@example.com"
          value={form.email}
          onChangeText={(v) => updateField('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Equipment Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the satellite dish(es) and mounting location (e.g. DirecTV dish on roof, chimney mount, etc.)"
          value={form.equipmentDescription}
          onChangeText={(v) => updateField('equipmentDescription', v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.primaryButton,
            status === 'submitting' && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={status === 'submitting'}
        >
          <Text style={styles.primaryButtonText}>
            {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    color: '#C62828',
    fontSize: 14,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
