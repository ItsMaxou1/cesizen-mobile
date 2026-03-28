import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '../../src/context/useAuth'
import { useRouter } from 'expo-router'

export default function ProfilPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Mon Profil</Text>
        <Text style={styles.texte}>Connectez-vous pour accéder à votre profil</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondaire} onPress={() => router.push('/register')}>
          <Text style={styles.btnSecondaireText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Mon Profil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Prénom</Text>
        <Text style={styles.valeur}>{user.prenom}</Text>
        <Text style={styles.label}>Nom</Text>
        <Text style={styles.valeur}>{user.nom}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.valeur}>{user.email}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/favoris')}>
        <Text style={styles.btnText}>⭐ Mes favoris</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/historique')}>
        <Text style={styles.btnText}>🕐 Mon historique</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleLogout}>
        <Text style={styles.btnText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    padding: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2d2d2d',
  },
  texte: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    marginTop: 12,
  },
  valeur: {
    fontSize: 16,
    color: '#2d2d2d',
    fontWeight: '500',
  },
  btn: {
    backgroundColor: '#2eaf8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnSecondaire: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2eaf8a',
  },
  btnSecondaireText: {
    color: '#2eaf8a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnDanger: {
    backgroundColor: '#e8405a',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})