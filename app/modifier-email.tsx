import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/context/useAuth'
import { API_URL } from '../src/config'
import { Ionicons } from '@expo/vector-icons'

export default function ModifierEmailPage() {
  const { token, user, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState(user?.email || '')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')

  const handleSave = async () => {
    if (!email) {
      setErreur('Veuillez entrer un email')
      return
    }
    if (email !== confirmation) {
      setErreur('Les emails ne correspondent pas')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/users/profil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) {
        setErreur(data.message)
        return
      }
      login(data, token!)
      Alert.alert('Succès', 'Email modifié avec succès')
      router.back()
    } catch {
      setErreur('Erreur serveur')
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>Modifier mon email</Text>
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

      <Text style={styles.label}>Email actuel: {user?.email}</Text>

      <TextInput
        style={styles.input}
        placeholder='Nouvel email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer l'email"
        value={confirmation}
        onChangeText={setConfirmation}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Sauvegarder</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    padding: 24,
  },
  retour: {
    marginBottom: 24,
    paddingTop: 8,
  },
  retourText: {
    color: '#2eaf8a',
    fontSize: 16,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  erreur: {
    color: '#e8405a',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#d0d8d4',
  },
  btn: {
    backgroundColor: '#2eaf8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
