import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

type JobStatus = 'Scheduled' | 'In Progress' | 'Completed';

interface JobData {
  id: string;
  homeownerName: string;
  address: string;
  phone: string;
  email: string;
  scheduledDate: string;
  status: JobStatus;
  equipmentDescription: string;
  notes: string;
}

const MOCK_JOBS: Record<string, JobData> = {
  '1': {
    id: '1',
    homeownerName: 'Jane Doe',
    address: '123 Elm Street, Springfield, IL 62701',
    phone: '(555) 123-4567',
    email: 'jane.doe@email.com',
    scheduledDate: '2024-02-15',
    status: 'Scheduled',
    equipmentDescription: 'DirecTV satellite dish on roof, single LNB. Coax cable runs through attic to living room. Standard tripod mount on asphalt shingles.',
    notes: '',
  },
  '2': {
    id: '2',
    homeownerName: 'John Smith',
    address: '456 Oak Avenue, Decatur, IL 62521',
    phone: '(555) 987-6543',
    email: 'john.smith@email.com',
    scheduledDate: '2024-02-15',
    status: 'In Progress',
    equipmentDescription: 'Dish Network dual-LNB dish, mounted on chimney with bracket. Two cable runs to basement splitter.',
    notes: 'Homeowner requested morning arrival. Dog in backyard — use front entrance.',
  },
  '3': {
    id: '3',
    homeownerName: 'Sarah Johnson',
    address: '789 Maple Drive, Champaign, IL 61820',
    phone: '(555) 456-7890',
    email: 'sarah.j@email.com',
    scheduledDate: '2024-02-16',
    status: 'Scheduled',
    equipmentDescription: 'Old C-band dish in backyard, large concrete mount. Approximately 6 feet diameter. Will require heavy equipment.',
    notes: '',
  },
  '4': {
    id: '4',
    homeownerName: 'Mike Williams',
    address: '321 Pine Road, Peoria, IL 61602',
    phone: '(555) 321-0987',
    email: 'mike.w@email.com',
    scheduledDate: '2024-02-16',
    status: 'Completed',
    equipmentDescription: 'HughesNet satellite dish on side of house. Wall mount with single cable run.',
    notes: 'Removal complete. Patched mounting holes with silicone. All materials sorted for recycling.',
  },
};

const statusColors: Record<JobStatus, string> = {
  Scheduled: '#1976D2',
  'In Progress': '#F57C00',
  Completed: '#2E7D32',
};

export default function JobDetail({ route, navigation }: Props) {
  const { jobId } = route.params;
  const jobData = MOCK_JOBS[jobId];

  const [status, setStatus] = useState<JobStatus>(jobData?.status ?? 'Scheduled');
  const [notes, setNotes] = useState(jobData?.notes ?? '');

  if (!jobData) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Job not found.</Text>
      </View>
    );
  }

  const handleStartJob = () => {
    Alert.alert('Start Job', 'Mark this job as In Progress?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start',
        onPress: () => setStatus('In Progress'),
      },
    ]);
  };

  const handleCompleteJob = () => {
    Alert.alert('Complete Job', 'Mark this job as Completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: () => setStatus('Completed'),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusColors[status] }]}>
        <Text style={styles.statusBannerText}>{status}</Text>
      </View>

      {/* Homeowner Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Homeowner</Text>
        <Text style={styles.primaryText}>{jobData.homeownerName}</Text>
        <Text style={styles.secondaryText}>📍 {jobData.address}</Text>
        <Text style={styles.secondaryText}>📞 {jobData.phone}</Text>
        <Text style={styles.secondaryText}>✉️ {jobData.email}</Text>
      </View>

      {/* Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <Text style={styles.primaryText}>📅 {jobData.scheduledDate}</Text>
      </View>

      {/* Equipment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment Details</Text>
        <Text style={styles.secondaryText}>{jobData.equipmentDescription}</Text>
      </View>

      {/* Technician Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technician Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes about the job, site conditions, materials recovered…"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          editable={status !== 'Completed'}
        />
      </View>

      {/* Photos Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photosPlaceholder}>
          <Text style={styles.photosPlaceholderText}>📷</Text>
          <Text style={styles.photosPlaceholderLabel}>
            Photo capture coming soon
          </Text>
          <Text style={styles.photosPlaceholderSub}>
            Before/after photos and material documentation
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {status !== 'Completed' && (
        <View style={styles.actionsSection}>
          {status === 'Scheduled' && (
            <TouchableOpacity style={styles.startButton} onPress={handleStartJob}>
              <Text style={styles.actionButtonText}>▶ Start Job</Text>
            </TouchableOpacity>
          )}
          {status === 'In Progress' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteJob}
            >
              <Text style={styles.actionButtonText}>✓ Complete Job</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {status === 'Completed' && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedBannerText}>
            ✅ Job completed — materials sent for recycling
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
  },
  statusBanner: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
    lineHeight: 20,
  },
  notesInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
  },
  photosPlaceholder: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
  },
  photosPlaceholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  photosPlaceholderLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  photosPlaceholderSub: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 4,
  },
  actionsSection: {
    padding: 16,
    paddingTop: 20,
  },
  startButton: {
    backgroundColor: '#F57C00',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedBanner: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  completedBannerText: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '600',
  },
});
