import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '../../src/context/useAuth'

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
  const [commentaires, setCommentaires] = useState<any[]>([])
  const [nouveauCommentaire, setNouveauCommentaire] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://10.0.2.2:3001/api/exercices/${id}`)
      const data = await res.json()
      setExercice(data)

      const resLikes = await fetch(`http://10.0.2.2:3001/api/likes/exercice/${id}`)
      const dataLikes = await resLikes.json()
      setLikes(dataLikes.count)

      const resCom = await fetch(`http://10.0.2.2:3001/api/commentaires/exercice/${id}`)
      const dataCom = await resCom.json()
      setCommentaires(dataCom)
    }
    load()
  }, [id])

  const handleLike = async () => {
    if (!user) return
    await fetch('http://10.0.2.2:3001/api/likes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: Number(id) })
    })
    const res = await fetch(`http://10.0.2.2:3001/api/likes/exercice/${id}`)
    const data = await res.json()
    setLikes(data.count)
  }

  const handleFavori = async () => {
    if (!user) return
    await fetch('http://10.0.2.2:3001/api/favoris/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciceId: Number(id) })
    })
  }

  const handleLancer = async () => {
    if (user) {
      await fetch('http://10.0.2.2:3001/api/historique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ exerciceId: Number(id) })
      })
    }
    router.push(`/exercice/lancer/${id}`)
  }

  const handleCommentaire = async () => {
    if (!user || !nouveauCommentaire) return
    await fetch('http://10.0.2.2:3001/api/commentaires', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ contenu: nouveauCommentaire, exerciceId: Number(id) })
    })
    setNouveauCommentaire('')
    const res = await fetch(`http://10.0.2.2:3001/api/commentaires/exercice/${id}`)
    const data = await res.json()
    setCommentaires(data)
  }

  if (!exercice) return <View><Text>Chargement...</Text></View>

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>{exercice.titre}</Text>
      <Text style={styles.categorie}>{exercice.categorie.nom}</Text>
      <Text style={styles.description}>{exercice.description}</Text>

      <View style={styles.infos}>
        <Text style={styles.info}>🕐 {exercice.duree_secondes}s</Text>
        <Text style={styles.info}>↑ {exercice.inspiration}s</Text>
        <Text style={styles.info}>⏸ {exercice.apnee}s</Text>
        <Text style={styles.info}>↓ {exercice.expiration}s</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Text style={styles.actionText}>❤️ {likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleFavori}>
          <Text style={styles.actionText}>⭐ Favori</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.lancerBtn} onPress={handleLancer}>
        <Text style={styles.lancerText}>Lancer l'exercice</Text>
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
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  infos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  info: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
  },
  lancerBtn: {
    backgroundColor: '#2eaf8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  lancerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 32,
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