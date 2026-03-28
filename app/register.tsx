import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/context/useAuth'

export default function RegisterPage() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, mot_de_passe: motDePasse })
      })
      const data = await res.json()
      if (!res.ok) {
        setErreur(data.message)
        return
      }
      login(data.user, data.token)
      router.replace('/')
    } catch {
      setErreur('Erreur serveur')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Inscription</Text>
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
      <TextInput
        style={styles.input}
        placeholder='Mot de passe'
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>S'inscrire</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.lien}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    padding: 24,
    justifyContent: 'center',
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2eaf8a',
    marginBottom: 32,
    textAlign: 'center',
  },
  erreur: {
    color: '#e8405a',
    marginBottom: 16,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lien: {
    color: '#2eaf8a',
    textAlign: 'center',
    fontSize: 14,
  },
})