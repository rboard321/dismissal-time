import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import StudentsScreen from './screens/StudentsScreen';
import CheckInScreen from './screens/CheckInScreen';
import QueueScreen from './screens/QueueScreen';
import useAppState from './hooks/useAppState';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Students" component={StudentsScreen} />
    <Tab.Screen name="CheckIn" component={CheckInScreen} />
    <Tab.Screen name="Queue" component={QueueScreen} />
  </Tab.Navigator>
);

const App = () => {
  const { teacher } = useAppState();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {teacher ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
