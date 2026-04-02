import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/context/useAuth'
import { API_URL } from '../../src/config'

interface Exercice {
  id: number
  titre: string
  description: string
  duree_secondes: number
  inspiration: number
  apnee: number
  expiration: number
  categorie: { nom: string }
}

export default function ExercicesPage() {
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [categorieFiltre, setCategorieFiltre] = useState('Tous')
  const [categories, setCategories] = useState<string[]>(['Tous'])
  const [likes, setLikes] = useState<{ [key: number]: number }>({})
  const [favoris, setFavoris] = useState<number[]>([])
  const router = useRouter()
  const { user, token } = useAuth()

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/api/exercices`)
      const data = await res.json()
      setExercices(data)
      const cats = ['Tous', ...new Set<string>(data.map((ex: Exercice) => ex.categorie.nom))]
      setCategories(cats)

      const likesData: { [key: number]: number } = {}
      for (const ex of data) {
        const resL = await fetch(`${API_URL}/api/likes/exercice/${ex.id}`)
        const dataL = await resL.json()
        likesData[ex.id] = dataL.count
      }
      setLikes(likesData)

      if (user && token) {
        const resFav = await fetch(`${API_URL}/api/favoris/mes-favoris`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const dataFav = await resFav.json()
        setFavoris(dataFav.map((f: any) => f.exerciceId))
      }
    }
    load()
  }, [])

  const filtres = categorieFiltre === 'Tous' ? exercices : exercices.filter(ex => ex.categorie.nom === categorieFiltre)

  const handleLike = async (id: number) => {
    if (!user) {
      router.push('/login')
      return
    }
    await fetch(`${API_URL}/api/likes/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: id })
    })
    const res = await fetch(`${API_URL}/api/likes/exercice/${id}`)
    const data = await res.json()
    setLikes(prev => ({ ...prev, [id]: data.count }))
  }

  const handleFavori = async (id: number) => {
    if (!user) {
      router.push('/login')
      return
    }
    await fetch(`${API_URL}/api/favoris/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: id })
    })
    setFavoris(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filtreHeader}>
        <Ionicons name='filter-outline' size={16} color='#666' />
        <Text style={styles.filtreHeaderText}>Filtrer par type :</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtres}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtre, categorieFiltre === cat && styles.filtreActif]}
            onPress={() => setCategorieFiltre(cat)}
          >
            <Text style={[styles.filtreText, categorieFiltre === cat && styles.filtreTextActif]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtres.map(ex => (
        <TouchableOpacity
          key={ex.id}
          style={styles.card}
          onPress={() => router.push(`/exercice/${ex.id}`)}
        >
          <View style={styles.cardTop}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitre}>{ex.titre}</Text>
              <View style={styles.cardMeta}>
                <Ionicons name='time-outline' size={14} color='#666' />
                <Text style={styles.cardMetaText}>{ex.duree_secondes}s</Text>
                <Text style={styles.cardMetaText}>{ex.categorie.nom}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleFavori(ex.id)}>
              <Ionicons
                name={favoris.includes(ex.id) ? 'star' : 'star-outline'}
                size={24}
                color={favoris.includes(ex.id) ? '#2d2d2d' : '#999'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.likeRow} onPress={() => handleLike(ex.id)}>
            <Ionicons
              name={user ? 'heart' : 'heart-outline'}
              size={18}
              color='#e8405a'
            />
            <Text style={styles.likeText}>{likes[ex.id] || 0}</Text>
          </TouchableOpacity>
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
  filtreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  filtreHeaderText: {
    fontSize: 14,
    color: '#666',
  },
  filtres: {
    marginBottom: 16,
  },
  filtre: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2eaf8a',
    marginRight: 8,
  },
  filtreActif: {
    backgroundColor: '#2eaf8a',
  },
  filtreText: {
    color: '#1d9470', // RGAA : contraste 3.8:1 sur fond clair
    fontSize: 14,
  },
  filtreTextActif: {
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardMetaText: {
    fontSize: 13,
    color: '#666',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  likeText: {
    fontSize: 14,
    color: '#e8405a',
    fontWeight: 'bold',
  },
})