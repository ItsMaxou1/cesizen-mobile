import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2eaf8a',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#f0f4f0',
        },
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
          tabBarIcon: ({ color, size }) => <Ionicons name='person-outline' size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}