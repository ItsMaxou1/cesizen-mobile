import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/context/useAuth'
import Svg, { Path } from 'react-native-svg'
import { API_URL } from '../../src/config'

interface Exercice {
  id: number
  titre: string
  duree_secondes: number
  categorie: { nom: string }
}

interface Contenu {
  id: number
  titre: string
  contenu: string
  categorie: { nom: string }
}

const Vagues = () => (
  <Svg height='40' width='100%' viewBox='0 0 1440 40'>
    <Path fill='white' d='M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z' />
  </Svg>
)

export default function IndexPage() {
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [contenus, setContenus] = useState<Contenu[]>([])
  const [likesEx, setLikesEx] = useState<{ [key: number]: number }>({})
  const [likesCo, setLikesCo] = useState<{ [key: number]: number }>({})
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { user, token } = useAuth()

  const load = async () => {
    const resEx = await fetch(`${API_URL}/api/exercices`)
    const dataEx = await resEx.json()
    setExercices(Array.isArray(dataEx) ? dataEx : [])

    const likesData: { [key: number]: number } = {}
    for (const ex of (Array.isArray(dataEx) ? dataEx : [])) {
      const res = await fetch(`${API_URL}/api/likes/exercice/${ex.id}`)
      const data = await res.json()
      likesData[ex.id] = data.count
    }
    setLikesEx(likesData)

    const resCo = await fetch(`${API_URL}/api/contenus`)
    const dataCo = await resCo.json()
    setContenus(Array.isArray(dataCo) ? dataCo : [])

    const likesDataCo: { [key: number]: number } = {}
    for (const co of (Array.isArray(dataCo) ? dataCo : [])) {
      const res = await fetch(`${API_URL}/api/likes/contenu/${co.id}`)
      const data = await res.json()
      likesDataCo[co.id] = data.count
    }
    setLikesCo(likesDataCo)
  }

  useEffect(() => {
    load()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const handleLike = async (type: 'exercice' | 'contenu', id: number) => {
    if (!user) {
      router.push('/login')
      return
    }
    await fetch(`${API_URL}/api/likes/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(type === 'exercice' ? { exerciceId: id } : { contenuId: id })
    })
    const res = await fetch(`${API_URL}/api/likes/${type}/${id}`)
    const data = await res.json()
    if (type === 'exercice') setLikesEx(prev => ({ ...prev, [id]: data.count }))
    else setLikesCo(prev => ({ ...prev, [id]: data.count }))
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2eaf8a']} />
      }
    >
      <View style={styles.header}>
        <Ionicons name='body-outline' size={48} color='#2eaf8a' style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Bienvenue sur CESIZen</Text>
        <Text style={styles.headerSubtitle}>Prenez un instant pour respirer et vous détendre</Text>
      </View>
      <Vagues />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercices de respiration :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {exercices.map(ex => (
            <TouchableOpacity
              key={ex.id}
              style={styles.cardHorizontal}
              onPress={() => router.push(`/exercice/${ex.id}`)}
            >
              <Text style={styles.cardTitle}>{ex.titre}</Text>
              <Text style={styles.cardSub}>{ex.duree_secondes}s</Text>
              <Text style={styles.cardSub}>{ex.categorie.nom}</Text>
              <TouchableOpacity style={styles.likeRow} onPress={() => handleLike('exercice', ex.id)}>
                <Ionicons name='heart' size={16} color='#e8405a' />
                <Text style={styles.likeText}>{likesEx[ex.id] || 0}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contenus informatifs :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {contenus.map(co => (
            <TouchableOpacity
              key={co.id}
              style={styles.cardHorizontal}
              onPress={() => router.push(`/contenu/${co.id}`)}
            >
              <Text style={styles.cardTitle}>{co.titre}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{co.contenu}</Text>
              <TouchableOpacity style={styles.likeRow} onPress={() => handleLike('contenu', co.id)}>
                <Ionicons name='heart' size={16} color='#e8405a' />
                <Text style={styles.likeText}>{likesCo[co.id] || 0}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  headerIcon: {
    marginBottom: 8,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    backgroundColor: '#7ECECA',
    borderRadius: 12,
    padding: 12,
    width: '31%',
  },
  cardHorizontal: {
    backgroundColor: '#7ECECA',
    borderRadius: 12,
    padding: 12,
    width: 120,
    marginRight: 8,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11,
    color: 'white',
    opacity: 0.85,
  },
  cardDesc: {
    fontSize: 11,
    color: 'white',
    opacity: 0.85,
    marginBottom: 4,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  likeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
})