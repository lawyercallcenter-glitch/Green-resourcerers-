import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { updateJobAsTechnician, type Job, type JobStatus } from '../api'

const COLORS = {
  greenDark: '#1a5c2a',
  greenMid: '#2e8b47',
  accent: '#f5a623',
  bg: '#f0f9f2',
  white: '#ffffff',
  border: '#d0e8d4',
  textSecondary: '#666',
  warning: '#b45309',
}

// Placeholder technician ID
const MY_TECHNICIAN_ID = 1

const STATUS_OPTIONS: Array<{ value: JobStatus; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

interface Props {
  job: Job
  onUpdated?: (job: Job) => void
}

export default function JobDetailScreen({ job, onUpdated }: Props) {
  const [status, setStatus] = useState<JobStatus>(job.status)
  const [dishesRemoved, setDishesRemoved] = useState(String(job.dishes_removed))
  const [weight, setWeight] = useState(String(job.materials_weight_lbs))
  const [notes, setNotes] = useState(job.technician_notes ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      const updated = await updateJobAsTechnician(MY_TECHNICIAN_ID, job.id, {
        status,
        dishes_removed: parseInt(dishesRemoved, 10) || 0,
        materials_weight_lbs: parseFloat(weight) || 0,
        technician_notes: notes || undefined,
      })
      Alert.alert('Saved ✅', 'Job updated successfully.')
      onUpdated?.(updated)
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Job #{job.id}</Text>

      {/* Status selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.statusBtn, status === opt.value && styles.statusBtnActive]}
              onPress={() => setStatus(opt.value)}
            >
              <Text style={[styles.statusBtnText, status === opt.value && styles.statusBtnTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Material capture */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Materials Collected</Text>
        <View style={styles.row}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Dishes Removed</Text>
            <TextInput
              style={styles.input}
              value={dishesRemoved}
              onChangeText={setDishesRemoved}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Total Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Technician Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Observations, access notes, issues encountered…"
          placeholderTextColor="#999"
        />
      </View>

      {/* Admin notes (read-only) */}
      {job.admin_notes ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Admin Notes</Text>
          <Text style={styles.readOnly}>{job.admin_notes}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.saveBtnText}>Save Update</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.greenDark, marginBottom: 16 },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.greenMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: COLORS.white,
  },
  statusBtnActive: {
    backgroundColor: COLORS.greenMid,
    borderColor: COLORS.greenMid,
  },
  statusBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
  statusBtnTextActive: { color: COLORS.white },
  row: { flexDirection: 'row', gap: 10 },
  fieldWrap: { flex: 1 },
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
  textarea: { height: 110 },
  readOnly: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  saveBtn: {
    backgroundColor: COLORS.greenMid,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
})
