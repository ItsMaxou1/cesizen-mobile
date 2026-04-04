import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
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

export default function ExerciceDetailPage() {
  const { id } = useLocalSearchParams()
  const { user, token } = useAuth()
  const router = useRouter()
  const [exercice, setExercice] = useState<Exercice | null>(null)
  const [likes, setLikes] = useState(0)
  const [isFavori, setIsFavori] = useState(false)
  const [commentaires, setCommentaires] = useState<any[]>([])
  const [nouveauCommentaire, setNouveauCommentaire] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/api/exercices/${id}`)
      const data = await res.json()
      setExercice(data)

      const resLikes = await fetch(`${API_URL}/api/likes/exercice/${id}`)
      const dataLikes = await resLikes.json()
      setLikes(dataLikes.count)

      const resCom = await fetch(`${API_URL}/api/commentaires/exercice/${id}`)
      const dataCom = await resCom.json()
      setCommentaires(dataCom)

      if (user && token) {
        const resFav = await fetch(`${API_URL}/api/favoris/mes-favoris`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const dataFav = await resFav.json()
        setIsFavori(dataFav.some((f: any) => f.exerciceId === Number(id)))
      }
    }
    load()
  }, [id])

  const handleLike = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    await fetch(`${API_URL}/api/likes/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: Number(id) })
    })
    const res = await fetch(`${API_URL}/api/likes/exercice/${id}`)
    const data = await res.json()
    setLikes(data.count)
  }

  const handleFavori = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    await fetch(`${API_URL}/api/favoris/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: Number(id) })
    })
    setIsFavori(prev => !prev)
  }

  const handleLancer = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    await fetch(`${API_URL}/api/historique`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: Number(id) })
    })
    router.push(`/exercice/lancer/${id}`)
  }

  const handleCommentaire = async () => {
    if (!user || !nouveauCommentaire) return
    await fetch(`${API_URL}/api/commentaires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ contenu: nouveauCommentaire, exerciceId: Number(id) })
    })
    setNouveauCommentaire('')
    const res = await fetch(`${API_URL}/api/commentaires/exercice/${id}`)
    const data = await res.json()
    setCommentaires(data)
  }

  if (!exercice) return <View><Text>Chargement...</Text></View>

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.metaRow}>
            <Ionicons name='time-outline' size={14} color='#666' />
            <Text style={styles.metaText}>{exercice.duree_secondes}s</Text>
            <Text style={styles.metaText}>{exercice.categorie.nom}</Text>
          </View>
          <Text style={styles.titre}>{exercice.titre}</Text>
        </View>
        <TouchableOpacity onPress={handleFavori}>
          <Ionicons
            name={isFavori ? 'star' : 'star-outline'}
            size={28}
            color={isFavori ? '#2d2d2d' : '#999'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{exercice.description}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.lancerBtn} onPress={handleLancer}>
          <Text style={styles.lancerText}>Lancer l'exercice</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.likeRow} onPress={handleLike}>
        <Ionicons
          name={user ? 'heart' : 'heart-outline'}
          size={20}
          color='#e8405a'
        />
        <Text style={styles.likeText}>{likes} personnes aiment cet exercice</Text>
      </TouchableOpacity>

      <Text style={styles.commentairesTitre}>Commentaires ({commentaires.length})</Text>
      {commentaires.map(c => (
        <View key={c.id} style={styles.commentaire}>
          <View style={styles.commentaireHeader}>
            <Text style={styles.commentaireAuteur}>{c.utilisateur.prenom} {c.utilisateur.nom}</Text>
            <Text style={styles.commentaireDate}>{new Date(c.createdAt).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.commentaireContenu}>{c.contenu}</Text>
        </View>
      ))}

      {user && (
        <View style={styles.nouveauCommentaire}>
          <Text style={styles.nouveauCommentaireTitre}>Ajouter un commentaire</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder='Votre commentaire...'
              value={nouveauCommentaire}
              onChangeText={setNouveauCommentaire}
              multiline
            />
            <TouchableOpacity style={styles.envoyerBtn} onPress={handleCommentaire}>
              <Text style={styles.envoyerText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 8,
  },
  retourText: {
    color: '#2eaf8a',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  actions: {
    marginBottom: 16,
  },
  lancerBtn: {
    backgroundColor: '#2eaf8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lancerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  likeText: {
    fontSize: 14,
    color: '#666',
  },
  commentairesTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d2d2d',
  },
  commentaire: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  commentaireHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentaireAuteur: {
    fontWeight: 'bold',
    color: '#2d2d2d',
    fontSize: 14,
  },
  commentaireDate: {
    fontSize: 12,
    color: '#999',
  },
  commentaireContenu: {
    fontSize: 14,
    color: '#444',
  },
  nouveauCommentaire: {
    marginTop: 8,
    marginBottom: 32,
  },
  nouveauCommentaireTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d0d8d4',
    minHeight: 50,
  },
  envoyerBtn: {
    backgroundColor: '#2eaf8a',
    padding: 14,
    borderRadius: 12,
  },
  envoyerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
})