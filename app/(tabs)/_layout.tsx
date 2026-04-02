import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { API_URL } from '../../src/config'

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1d9470', // RGAA : contraste 3.8:1 sur fond blanc
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
            tabBarIcon: ({ color, size }) => <Ionicons name='home-outline' size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name='exercices'
          options={{
            title: 'Exercices',
            tabBarIcon: ({ color, size }) => <Ionicons name='fitness-outline' size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name='profil'
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <Ionicons name='person-outline' size={size} color={color} />
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}