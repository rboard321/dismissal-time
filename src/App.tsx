import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './screens/LoginScreen';
import StudentsScreen from './screens/StudentsScreen';
import CheckInScreen from './screens/CheckInScreen';
import QueueScreen from './screens/QueueScreen';

// Hooks
import { useAppState } from './hooks/useAppState';

// Types
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: { [key: string]: string } = {
    Students: '👥',
    CheckIn: '🚗',
    Queue: '📋',
  };

  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
      {icons[name] || '📱'}
    </Text>
  );
};

const MainTabs = () => {
  const { students, queue, addToQueue, completePickup, getStudentsForCar } =
    useAppState();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1f2937',
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name="Students" options={{ headerShown: false }}>
        {() => <StudentsScreen students={students} />}
      </Tab.Screen>

      <Tab.Screen
        name="CheckIn"
        options={{
          title: 'Check In',
          headerShown: false,
        }}
      >
        {() => (
          <CheckInScreen
            getStudentsForCar={getStudentsForCar}
            addToQueue={addToQueue}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Queue" options={{ headerShown: false }}>
        {() => <QueueScreen queue={queue} completePickup={completePickup} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingIcon}>🏫</Text>
    <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
    <Text style={styles.loadingText}>Loading Dismissal Manager...</Text>
  </View>
);

const App = () => {
  const { user, loading } = useAppState();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen onLoginSuccess={() => navigation.replace('Main')} />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
  },
  loadingIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
});

export default App;

