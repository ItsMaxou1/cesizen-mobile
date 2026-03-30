import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/context/useAuth'

export default function FavorisPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [favoris, setFavoris] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://10.176.137.120:3001/api/favoris/mes-favoris', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setFavoris(data)
    }
    load()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.titre}>Mes favoris</Text>
      {favoris.length === 0 && <Text style={styles.vide}>Aucun favori pour l'instant</Text>}
      {favoris.map(f => (
        <TouchableOpacity
          key={f.id}
          style={styles.card}
          onPress={() => router.push(`/exercice/${f.exercice.id}`)}
        >
          <Text style={styles.cardTitre}>{f.exercice.titre}</Text>
          <Text style={styles.cardSub}>{f.exercice.duree_secondes}s • {f.exercice.categorie?.nom}</Text>
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