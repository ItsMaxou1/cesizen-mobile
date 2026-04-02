import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/context/useAuth'
import { API_URL } from '../../src/config'

export default function ContenuDetailPage() {
  const { id } = useLocalSearchParams()
  const { user, token } = useAuth()
  const router = useRouter()
  const [contenu, setContenu] = useState<any>(null)
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [commentaires, setCommentaires] = useState<any[]>([])
  const [nouveauCommentaire, setNouveauCommentaire] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/api/contenus/${id}`)
      const data = await res.json()
      setContenu(data)

      const resLikes = await fetch(`${API_URL}/api/likes/contenu/${id}`)
      const dataLikes = await resLikes.json()
      setLikes(dataLikes.count)

      if (user && token) {
        const resUserLike = await fetch(`${API_URL}/api/likes/contenu/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const dataUserLike = await resUserLike.json()
        setIsLiked(dataUserLike.isLiked || false)
      }

      const resCom = await fetch(`${API_URL}/api/commentaires/contenu/${id}`)
      const dataCom = await resCom.json()
      setCommentaires(dataCom)
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
      body: JSON.stringify({ contenuId: Number(id) })
    })
    const res = await fetch(`${API_URL}/api/likes/contenu/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setLikes(data.count)
    setIsLiked(data.isLiked || false)
  }

  const handleCommentaire = async () => {
    if (!user || !nouveauCommentaire) return
    await fetch(`${API_URL}/api/commentaires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ contenu: nouveauCommentaire, contenuId: Number(id) })
    })
    setNouveauCommentaire('')
    const res = await fetch(`${API_URL}/api/commentaires/contenu/${id}`)
    const data = await res.json()
    setCommentaires(data)
  }

  if (!contenu) return <View><Text>Chargement...</Text></View>

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.categorie}>{contenu.categorie.nom}</Text>
        <Text style={styles.titre}>{contenu.titre}</Text>
      </View>

      <View style={styles.contenuCard}>
        <Text style={styles.contenu}>{contenu.contenu}</Text>
        <View style={styles.separateur} />
        <TouchableOpacity style={styles.likeRow} onPress={handleLike}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? '#e8405a' : '#999'}
          />
          <Text style={styles.likeText}>{likes} personnes aiment ce contenu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.commentairesTitre}>Commentaires ({commentaires.length})</Text>
      {commentaires.map(c => (
        <View key={c.id} style={styles.commentaire}>
          <View style={styles.commentaireHeader}>
            <Text style={styles.commentaireAuteur}>{c.utilisateur.prenom} {c.utilisateur.nom[0]}.</Text>
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
  },
  retourText: {
    color: '#2eaf8a',
    fontSize: 16,
  },
  header: {
    marginBottom: 16,
  },
  categorie: {
    color: '#2eaf8a',
    fontSize: 13,
    marginBottom: 6,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  contenuCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contenu: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
  separateur: {
    height: 1,
    backgroundColor: '#f0f4f0',
    marginBottom: 12,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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