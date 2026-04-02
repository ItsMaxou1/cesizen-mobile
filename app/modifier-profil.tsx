import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/context/useAuth'
import { API_URL } from '../src/config'
import { Ionicons } from '@expo/vector-icons'

export default function ModifierProfilPage() {
  const { token, user, login } = useAuth()
  const router = useRouter()
  const [nom, setNom] = useState(user?.nom || '')
  const [prenom, setPrenom] = useState(user?.prenom || '')
  const [email, setEmail] = useState(user?.email || '')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [erreur, setErreur] = useState('')

  const handleSave = async () => {
    if (motDePasse && motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    const body: any = { nom, prenom, email }
    if (motDePasse) body.mot_de_passe = motDePasse

    try {
      const res = await fetch(`${API_URL}/api/users/profil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) {
        setErreur(data.message)
        return
      }
      login(data, token!)
      Alert.alert('Succès', 'Profil modifié avec succès')
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

      <Text style={styles.titre}>Modifier mon profil</Text>
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder='Prénom'
        value={prenom}
        onChangeText={setPrenom}
      />
      <TextInput
        style={styles.input}
        placeholder='Nom'
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder='Nouveau mot de passe (laisser vide pour ne pas changer)'
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.togglePassword}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color='#2eaf8a'
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder='Confirmer le mot de passe'
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry={!showConfirmation}
        />
        <TouchableOpacity
          style={styles.togglePassword}
          onPress={() => setShowConfirmation(!showConfirmation)}
        >
          <Ionicons
            name={showConfirmation ? 'eye' : 'eye-off'}
            size={20}
            color='#2eaf8a'
          />
        </TouchableOpacity>
      </View>

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
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  togglePassword: {
    position: 'absolute',
    right: 14,
    padding: 8,
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