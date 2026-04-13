import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { submitRequest } from '../api'

const COLORS = {
  greenDark: '#1a5c2a',
  greenMid: '#2e8b47',
  accent: '#f5a623',
  bg: '#f0f9f2',
  white: '#ffffff',
  border: '#d0e8d4',
  textSecondary: '#666',
  error: '#b42318',
}

interface FormState {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  dish_count: string
  dish_location: string
  notes: string
}

const EMPTY_FORM: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  dish_count: '1',
  dish_location: '',
  notes: '',
}

export default function HomeownerRequestScreen() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const set = useCallback((key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  async function handleSubmit() {
    const required: (keyof FormState)[] = [
      'first_name', 'last_name', 'email', 'phone',
      'address', 'city', 'state', 'zip_code',
    ]
    const missing = required.filter((k) => !form[k].trim())
    if (missing.length) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      const result = await submitRequest({
        ...form,
        dish_count: parseInt(form.dish_count, 10) || 1,
        dish_location: form.dish_location || null,
        notes: form.notes || null,
      } as Parameters<typeof submitRequest>[0])

      Alert.alert(
        'Request Submitted! ✅',
        `Your request #${result.id} has been received. We'll contact you within 1–2 business days.`,
        [{ text: 'OK', onPress: () => setForm(EMPTY_FORM) }],
      )
    } catch (err) {
      Alert.alert('Submission Failed', err instanceof Error ? err.message : 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const field = (
    label: string,
    key: keyof FormState,
    props?: Partial<React.ComponentProps<typeof TextInput>>,
  ) => (
    <View style={styles.fieldWrap} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={form[key]}
        onChangeText={(v) => set(key, v)}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Request Free Dish Removal</Text>
        <Text style={styles.subtitle}>
          We'll schedule a certified technician at no cost to you.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Contact Information</Text>
          <View style={styles.row}>
            {field('First Name *', 'first_name', { placeholder: 'Jane', autoCapitalize: 'words' })}
            {field('Last Name *', 'last_name', { placeholder: 'Smith', autoCapitalize: 'words' })}
          </View>
          {field('Email *', 'email', {
            placeholder: 'jane@example.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}
          {field('Phone *', 'phone', { placeholder: '(555) 555-0001', keyboardType: 'phone-pad' })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Property Address</Text>
          {field('Street Address *', 'address', { placeholder: '123 Elm Street', autoCapitalize: 'words' })}
          {field('City *', 'city', { placeholder: 'Springfield', autoCapitalize: 'words' })}
          <View style={styles.row}>
            {field('State *', 'state', { placeholder: 'IL', autoCapitalize: 'characters', maxLength: 2 })}
            {field('ZIP Code *', 'zip_code', { placeholder: '62701', keyboardType: 'number-pad', maxLength: 10 })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dish Details</Text>
          {field('Number of Dishes', 'dish_count', { keyboardType: 'number-pad', maxLength: 2 })}
          {field('Dish Location', 'dish_location', { placeholder: 'e.g., Roof — south side' })}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={form.notes}
              onChangeText={(v) => set('notes', v)}
              placeholder="Access instructions, old provider, etc."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitText}>Submit Request — It's Free!</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.greenDark,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.greenMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 10 },
  fieldWrap: { marginBottom: 12, flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: COLORS.white,
  },
  textarea: { height: 90 },
  submitBtn: {
    backgroundColor: COLORS.greenMid,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitDisabled: { opacity: 0.7 },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
})
