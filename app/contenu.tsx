import { useEffect, useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from './../src/context/useAuth'

export default function ContenuDetailPage() {
  const { id } = useLocalSearchParams()
  const { user, token } = useAuth()
  const router = useRouter()
  const [contenu, setContenu] = useState<any>(null)
  const [likes, setLikes] = useState(0)
  const [commentaires, setCommentaires] = useState<any[]>([])
  const [nouveauCommentaire, setNouveauCommentaire] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://10.176.137.120:3001/api/contenus/${id}`)
      const data = await res.json()
      setContenu(data)

      const resLikes = await fetch(`http://10.176.137.120:3001/api/likes/contenu/${id}`)
      const dataLikes = await resLikes.json()
      setLikes(dataLikes.count)

      const resCom = await fetch(`http://10.176.137.120:3001/api/commentaires/contenu/${id}`)
      const dataCom = await resCom.json()
      setCommentaires(dataCom)
    }
    load()
  }, [id])

  const handleLike = async () => {
    if (!user) return
    await fetch('http://10.176.137.120:3001/api/likes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ contenuId: Number(id) })
    })
    const res = await fetch(`http://10.176.137.120:3001/api/likes/contenu/${id}`)
    const data = await res.json()
    setLikes(data.count)
  }

  const handleCommentaire = async () => {
    if (!user || !nouveauCommentaire) return
    await fetch('http://10.176.137.120:3001/api/commentaires', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ contenu: nouveauCommentaire, contenuId: Number(id) })
    })
    setNouveauCommentaire('')
    const res = await fetch(`http://10.176.137.120:3001/api/commentaires/contenu/${id}`)
    const data = await res.json()
    setCommentaires(data)
  }

  if (!contenu) return <View><Text>Chargement...</Text></View>

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>{contenu.titre}</Text>
      <Text style={styles.categorie}>{contenu.categorie.nom}</Text>
      <Text style={styles.contenu}>{contenu.contenu}</Text>

      <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
        <Text style={styles.likeBtnText}>❤️ {likes}</Text>
      </TouchableOpacity>

      <Text style={styles.commentairesTitre}>Commentaires</Text>
      {commentaires.map(c => (
        <View key={c.id} style={styles.commentaire}>
          <Text style={styles.commentaireAuteur}>{c.utilisateur.prenom} {c.utilisateur.nom}</Text>
          <Text style={styles.commentaireContenu}>{c.contenu}</Text>
        </View>
      ))}

      {user && (
        <View style={styles.nouveauCommentaire}>
          <TextInput
            style={styles.input}
            placeholder='Ajouter un commentaire...'
            value={nouveauCommentaire}
            onChangeText={setNouveauCommentaire}
            multiline
          />
          <TouchableOpacity style={styles.btn} onPress={handleCommentaire}>
            <Text style={styles.btnText}>Envoyer</Text>
          </TouchableOpacity>
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
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  categorie: {
    color: '#2eaf8a',
    fontSize: 14,
    marginBottom: 16,
  },
  contenu: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  likeBtn: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  likeBtnText: {
    fontSize: 16,
  },
  commentairesTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d2d2d',
  },
  commentaire: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentaireAuteur: {
    fontWeight: 'bold',
    color: '#2eaf8a',
    marginBottom: 4,
  },
  commentaireContenu: {
    fontSize: 14,
    color: '#444',
  },
  nouveauCommentaire: {
    marginTop: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d0d8d4',
    minHeight: 80,
  },
  btn: {
    backgroundColor: '#2eaf8a',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
})