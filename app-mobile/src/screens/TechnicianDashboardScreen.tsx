import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { getTechnicianJobs, type Job, type JobStatus } from '../api'

const COLORS = {
  greenDark: '#1a5c2a',
  greenMid: '#2e8b47',
  accent: '#f5a623',
  bg: '#f0f9f2',
  white: '#ffffff',
  border: '#d0e8d4',
  textSecondary: '#666',
  error: '#b42318',
  warning: '#b45309',
}

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: COLORS.greenMid, bg: '#e8f5e9' },
  in_progress: { label: 'In Progress', color: COLORS.warning, bg: '#fef3c7' },
  completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7' },
  on_hold: { label: 'On Hold', color: '#9333ea', bg: '#f3e8ff' },
}

// Placeholder technician ID — in a real app this comes from auth context
const MY_TECHNICIAN_ID = 1

interface Props {
  onSelectJob?: (job: Job) => void
}

export default function TechnicianDashboardScreen({ onSelectJob }: Props) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<JobStatus | undefined>(undefined)

  const loadJobs = useCallback(async () => {
    try {
      const data = await getTechnicianJobs(MY_TECHNICIAN_ID, filter)
      setJobs(data)
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to load jobs')
    }
  }, [filter])

  useEffect(() => {
    setLoading(true)
    loadJobs().finally(() => setLoading(false))
  }, [loadJobs])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadJobs()
    setRefreshing(false)
  }, [loadJobs])

  const FILTERS: Array<{ label: string; value: JobStatus | undefined }> = [
    { label: 'All', value: undefined },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ]

  function renderJob({ item }: { item: Job }) {
    const cfg = STATUS_CONFIG[item.status]
    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => onSelectJob?.(item)}
        activeOpacity={0.75}
      >
        <View style={styles.jobHeader}>
          <Text style={styles.jobId}>Job #{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {item.scheduled_date && (
          <Text style={styles.jobMeta}>
            📅 {new Date(item.scheduled_date).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
            })}
          </Text>
        )}

        <View style={styles.jobStats}>
          <Text style={styles.statItem}>🛰️ {item.dishes_removed} removed</Text>
          <Text style={styles.statItem}>⚖️ {item.materials_weight_lbs.toFixed(1)} lbs</Text>
        </View>

        {item.admin_notes ? (
          <Text style={styles.jobNotes} numberOfLines={2}>
            📋 {item.admin_notes}
          </Text>
        ) : null}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={String(f.value)}
            style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.greenMid} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => String(j.id)}
          renderItem={renderJob}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No jobs found.</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.greenMid,
  },
  filterTabText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  filterTabTextActive: { color: COLORS.greenMid },
  list: { padding: 12 },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobId: { fontSize: 16, fontWeight: '800', color: COLORS.greenDark },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  jobMeta: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  jobStats: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  statItem: { fontSize: 13, color: COLORS.textSecondary },
  jobNotes: { fontSize: 13, color: '#555', fontStyle: 'italic' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: COLORS.textSecondary, fontSize: 15 },
})
