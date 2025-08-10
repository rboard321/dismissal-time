import { Tabs } from 'expo-router'
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: 'center' }}>
      <Tabs.Screen name="students" options={{ title: 'Students' }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check In' }} />
      <Tabs.Screen name="queue" options={{ title: 'Queue' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
    </Tabs>
  )
}
