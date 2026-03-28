import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '../../src/context/useAuth'

interface Exercice {
  id: number
  titre: string
  description: string
  duree_secondes: number
  categorie: { nom: string }
}

interface Contenu {
  id: number
  titre: string
  contenu: string
  categorie: { nom: string }
}

export default function IndexPage() {
  const { user, token } = useAuth()
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [contenus, setContenus] = useState<Contenu[]>([])

  useEffect(() => {
    const load = async () => {
      const resEx = await fetch('http://10.0.2.2:3001/api/exercices')
      const dataEx = await resEx.json()
      setExercices(dataEx.slice(0, 3))

      const resCo = await fetch('http://10.0.2.2:3001/api/contenus')
      const dataCo = await resCo.json()
      setContenus(dataCo.slice(0, 3))
    }
    load()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienvenue sur CESIZen</Text>
        <Text style={styles.headerSubtitle}>Prenez un instant pour respirer et vous détendre</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercices de respiration :</Text>
        {exercices.map(ex => (
          <TouchableOpacity key={ex.id} style={styles.card}>
            <Text style={styles.cardTitle}>{ex.titre}</Text>
            <Text style={styles.cardSub}>{ex.duree_secondes}s • {ex.categorie.nom}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contenus informatifs :</Text>
        {contenus.map(co => (
          <TouchableOpacity key={co.id} style={styles.card}>
            <Text style={styles.cardTitle}>{co.titre}</Text>
            <Text style={styles.cardSub}>{co.categorie.nom}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },
  header: {
    backgroundColor: '#F5F0C8',
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d2d2d',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d2d2d',
  },
  card: {
    backgroundColor: '#7ECECA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: 'white',
    opacity: 0.85,
  },
})