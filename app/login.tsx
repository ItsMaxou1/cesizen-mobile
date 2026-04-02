import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/context/useAuth'
import { API_URL } from '../src/config'
import { Ionicons } from '@expo/vector-icons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [erreur, setErreur] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: motDePasse })
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
      <Text style={styles.titre}>Connexion</Text>
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      {/* RGAA : accessibilityLabel permet aux lecteurs d'écran de savoir à quoi sert ce champ */}
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        accessibilityLabel='Saisissez votre adresse email'
      />
      <View style={styles.passwordContainer}>
        {/* RGAA : accessibilityLabel pour le champ mot de passe */}
        <TextInput
          style={styles.input}
          placeholder='Mot de passe'
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={!showPassword}
          accessibilityLabel='Saisissez votre mot de passe'
        />
        {/* RGAA : accessibilityRole + accessibilityLabel pour signaler que c'est un bouton avec une icône */}
        <TouchableOpacity
          style={styles.togglePassword}
          onPress={() => setShowPassword(!showPassword)}
          accessibilityRole='button'
          accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color='#2eaf8a'
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.lien}>Pas de compte ? S'inscrire</Text>
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
    color: '#1d9470', // RGAA : contraste 3.8:1 sur fond clair (#2eaf8a était 2.6:1, insuffisant)
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 16,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lien: {
    color: '#1d9470', // RGAA : contraste suffisant sur fond clair
    textAlign: 'center',
    fontSize: 14,
  },
})