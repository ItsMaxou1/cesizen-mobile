import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

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
        <Tabs.Screen name='index' options={{ title: 'Accueil' }} />
        <Tabs.Screen name='exercices' options={{ title: 'Exercices' }} />
        <Tabs.Screen name='profil' options={{ title: 'Profil' }} />
      </Tabs>
    </SafeAreaView>
  )
}