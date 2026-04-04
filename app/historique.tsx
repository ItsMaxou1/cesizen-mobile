import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../src/context/useAuth'
import { API_URL } from '../src/config'

export default function HistoriquePage() {
  const { token } = useAuth()
  const router = useRouter()
  const [historique, setHistorique] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/api/historique/mon-historique`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setHistorique(data)
    }
    load()
  }, [])

  const handleDeleteHistorique = () => {
    Alert.alert(
      'Supprimer l\'historique',
      'Êtes-vous sûr de vouloir supprimer tout votre historique ?',
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/api/historique/supprimer-tout`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              })
              if (res.ok) {
                Alert.alert('Succès', 'Historique supprimé')
                setHistorique([])
              } else {
                Alert.alert('Erreur', 'Impossible de supprimer l\'historique')
              }
            } catch {
              Alert.alert('Erreur', 'Erreur serveur')
            }
          },
          style: 'destructive'
        }
      ]
    )
  }

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
      {historique.length > 0 && (
        <TouchableOpacity style={styles.btnDanger} onPress={handleDeleteHistorique}>
          <Ionicons name='trash-outline' size={20} color='white' />
          <Text style={styles.btnDangerText}>Supprimer tout l'historique</Text>
        </TouchableOpacity>
      )}
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
  btnDanger: {
    backgroundColor: '#e8405a',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDangerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})