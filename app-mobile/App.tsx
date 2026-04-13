import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import TechnicianDashboard from './src/screens/TechnicianDashboard';
import HomeownerRequest from './src/screens/HomeownerRequest';
import JobDetail from './src/screens/JobDetail';

export type RootStackParamList = {
  TechnicianDashboard: undefined;
  HomeownerRequest: undefined;
  JobDetail: { jobId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="TechnicianDashboard"
        screenOptions={{
          headerStyle: { backgroundColor: '#2E7D32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="TechnicianDashboard"
          component={TechnicianDashboard}
          options={{ title: 'Green Resourcerers' }}
        />
        <Stack.Screen
          name="HomeownerRequest"
          component={HomeownerRequest}
          options={{ title: 'Request Removal' }}
        />
        <Stack.Screen
          name="JobDetail"
          component={JobDetail}
          options={{ title: 'Job Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
