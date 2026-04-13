import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'TechnicianDashboard'>;

interface Job {
  id: string;
  address: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  homeownerName: string;
  equipmentDescription: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    address: '123 Elm Street, Springfield, IL 62701',
    scheduledDate: '2024-02-15',
    status: 'Scheduled',
    homeownerName: 'Jane Doe',
    equipmentDescription: 'DirecTV satellite dish on roof, single LNB',
  },
  {
    id: '2',
    address: '456 Oak Avenue, Decatur, IL 62521',
    scheduledDate: '2024-02-15',
    status: 'In Progress',
    homeownerName: 'John Smith',
    equipmentDescription: 'Dish Network dual-LNB dish, mounted on chimney',
  },
  {
    id: '3',
    address: '789 Maple Drive, Champaign, IL 61820',
    scheduledDate: '2024-02-16',
    status: 'Scheduled',
    homeownerName: 'Sarah Johnson',
    equipmentDescription: 'Old C-band dish in backyard, large mount',
  },
  {
    id: '4',
    address: '321 Pine Road, Peoria, IL 61602',
    scheduledDate: '2024-02-16',
    status: 'Completed',
    homeownerName: 'Mike Williams',
    equipmentDescription: 'HughesNet satellite dish on side of house',
  },
];

const statusColors: Record<Job['status'], string> = {
  Scheduled: '#1976D2',
  'In Progress': '#F57C00',
  Completed: '#2E7D32',
};

export default function TechnicianDashboard({ navigation }: Props) {
  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.homeownerName}>{item.homeownerName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status] },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.date}>📅 {item.scheduledDate}</Text>
      <Text style={styles.equipment} numberOfLines={1}>
        🛰️ {item.equipmentDescription}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome, Technician</Text>
        <Text style={styles.subtitle}>
          The Green Resourcerers LLC — Satellite Dish Removal &amp; Recycling
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('HomeownerRequest')}
        >
          <Text style={styles.actionButtonText}>+ New Homeowner Request</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Assigned Jobs</Text>

      <FlatList
        data={MOCK_JOBS}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  welcomeSection: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#C8E6C9',
    marginTop: 4,
  },
  actionsRow: {
    padding: 16,
    paddingBottom: 8,
  },
  actionButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#777',
    marginBottom: 2,
  },
  equipment: {
    fontSize: 13,
    color: '#777',
  },
});
