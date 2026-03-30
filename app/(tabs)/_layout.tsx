import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2eaf8a',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#f0f4f0',
          }
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='exercices'
          options={{
            title: 'Exercices',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='profil'
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}