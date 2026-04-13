/**
 * App entry point — uses React Navigation with a bottom tab bar.
 *
 * Tab 1: Technician Dashboard (job list + detail)
 * Tab 2: Homeowner Request (submit a removal request from the field)
 */
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'

import TechnicianDashboardScreen from './src/screens/TechnicianDashboardScreen'
import JobDetailScreen from './src/screens/JobDetailScreen'
import HomeownerRequestScreen from './src/screens/HomeownerRequestScreen'
import { type Job } from './src/api'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Technician stack: Dashboard → Job Detail
function TechnicianStack() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  if (selectedJob) {
    return (
      <JobDetailScreen
        job={selectedJob}
        onUpdated={(updated) => setSelectedJob(updated)}
      />
    )
  }

  return <TechnicianDashboardScreen onSelectJob={setSelectedJob} />
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ opacity: focused ? 1 : 0.5 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1a5c2a" />
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#1a5c2a' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '700' },
            tabBarActiveTintColor: '#2e8b47',
            tabBarInactiveTintColor: '#888',
          }}
        >
          <Tab.Screen
            name="MyJobs"
            component={TechnicianStack}
            options={{
              title: 'My Jobs',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🔧" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="NewRequest"
            component={HomeownerRequestScreen}
            options={{
              title: 'Request Removal',
              tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
