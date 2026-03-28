import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/context/useAuth'

export default function HistoriquePage() {
  const { token } = useAuth()
  const router = useRouter()
  const [historique, setHistorique] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://10.0.2.2:3001/api/historique/mon-historique', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setHistorique(data)
    }
    load()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.titre}>Mon historique</Text>
      {historique.length === 0 && <Text style={styles.vide}>Aucun exercice effectué pour l'instant</Text>}
      {historique.map(h => (
        <TouchableOpacity
          key={h.id}
          style={styles.card}
          onPress={() => router.push(`/exercice/${h.exercice.id}`)}
        >
          <Text style={styles.cardTitre}>{h.exercice.titre}</Text>
          <Text style={styles.cardSub}>{new Date(h.date_realisation).toLocaleDateString()}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    padding: 16,
  },
  retour: {
    marginBottom: 16,
  },
  retourText: {
    color: '#2eaf8a',
    fontSize: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2d2d2d',
  },
  vide: {
    color: '#999',
    textAlign: 'center',
    marginTop: 48,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#666',
  },
})