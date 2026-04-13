import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_BASE = 'http://localhost:8000'; // Change to LAN IP for device testing

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------
function HomeScreen({ navigate }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>🌿 Green Resourcerers</Text>
      <Text style={styles.subtitle}>Satellite Dish Removal & Recycling</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigate('Request')}>
        <Text style={styles.btnText}>Submit Removal Request</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => navigate('Jobs')}>
        <Text style={styles.btnText}>Technician Job List</Text>
      </TouchableOpacity>
    </View>
  );
}

function RequestScreen({ navigate }) {
  const [form, setForm] = useState({ homeowner_name: '', address: '', phone: '', email: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.homeowner_name || !form.address || !form.phone) {
      Alert.alert('Missing Fields', 'Name, address, and phone are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        Alert.alert('Success', 'Your request has been submitted!', [{ text: 'OK', onPress: () => navigate('Home') }]);
      } else {
        Alert.alert('Error', 'Failed to submit request.');
      }
    } catch {
      Alert.alert('Error', 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Request Removal</Text>
      {['homeowner_name', 'address', 'phone', 'email', 'notes'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          value={form[field]}
          onChangeText={(v) => setForm({ ...form, [field]: v })}
        />
      ))}
      {loading ? <ActivityIndicator /> : (
        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigate('Home')}><Text style={styles.link}>← Back</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

function JobsScreen({ navigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/jobs`)
      .then((r) => r.json())
      .then(setJobs)
      .catch(() => Alert.alert('Error', 'Could not load jobs.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Job List</Text>
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigate('JobDetail', item)}>
              <Text style={styles.cardTitle}>{item.homeowner_name}</Text>
              <Text>{item.address}</Text>
              <Text style={styles.status}>{item.status.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity onPress={() => navigate('Home')}><Text style={styles.link}>← Back</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

function JobDetailScreen({ job, navigate }) {
  const [status, setStatus] = useState(job.status);
  const [notes, setNotes] = useState(job.technician_notes || '');
  const [loading, setLoading] = useState(false);

  const update = async (newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, technician_notes: notes }),
      });
      if (res.ok) {
        setStatus(newStatus);
        Alert.alert('Updated', `Status set to ${newStatus}`);
      } else {
        Alert.alert('Error', 'Update failed.');
      }
    } catch {
      Alert.alert('Error', 'Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{job.homeowner_name}</Text>
      <Text>{job.address}</Text>
      <Text>{job.phone}</Text>
      <Text style={styles.status}>{status.toUpperCase()}</Text>
      <TextInput style={styles.input} placeholder="Technician notes" value={notes} onChangeText={setNotes} multiline />
      {loading ? <ActivityIndicator /> : (
        <View>
          {['scheduled', 'in_progress', 'completed'].map((s) => (
            <TouchableOpacity key={s} style={styles.btn} onPress={() => update(s)}>
              <Text style={styles.btnText}>Mark {s.replace('_', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => navigate('Jobs')}><Text style={styles.link}>← Back to Jobs</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// App (simple in-app router)
// ---------------------------------------------------------------------------
export default function App() {
  const [screen, setScreen] = useState('Home');
  const [params, setParams] = useState(null);

  const navigate = (name, p = null) => { setScreen(name); setParams(p); };

  if (screen === 'Request') return <RequestScreen navigate={navigate} />;
  if (screen === 'Jobs') return <JobsScreen navigate={navigate} />;
  if (screen === 'JobDetail') return <JobDetailScreen job={params} navigate={navigate} />;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <HomeScreen navigate={navigate} />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#2d6a4f' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24 },
  btn: { backgroundColor: '#2d6a4f', padding: 14, borderRadius: 8, marginVertical: 8, width: '100%', alignItems: 'center' },
  btnSecondary: { backgroundColor: '#52b788' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 6, backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginVertical: 6, elevation: 2 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  status: { color: '#52b788', fontWeight: '600', marginTop: 4 },
  link: { color: '#2d6a4f', marginTop: 16, textAlign: 'center' },
});
