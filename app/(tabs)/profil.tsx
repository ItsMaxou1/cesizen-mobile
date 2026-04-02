import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/context/useAuth'
import { API_URL } from '../../src/config'

export default function ProfilPage() {
  const { user, logout, token } = useAuth()
  const router = useRouter()
  const [favoris, setFavoris] = useState<any[]>([])
  const [historique, setHistorique] = useState<any[]>([])

  useEffect(() => {
    if (!user || !token) return
    const load = async () => {
      const resFav = await fetch(`${API_URL}/api/favoris/mes-favoris`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const dataFav = await resFav.json()
      setFavoris(dataFav.slice(0, 3))

      const resHist = await fetch(`${API_URL}/api/historique/mon-historique`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const dataHist = await resHist.json()
      setHistorique(dataHist.slice(0, 3))
    }
    load()
  }, [user])

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

      {/* RGAA : accessibilityRole + accessibilityLabel pour les boutons d'action avec icônes */}
      <TouchableOpacity 
        style={styles.actionBtn} 
        onPress={() => router.push('/modifier-email')}
        accessibilityRole='button'
        accessibilityLabel='Modifier votre adresse email'
      >
        <Ionicons name='mail-outline' size={20} color='#2d2d2d' />
        <Text style={styles.actionBtnText}>Modifier l'email</Text>
      </TouchableOpacity>

      {/* RGAA : accessibilityRole + accessibilityLabel pour le bouton modifier mot de passe */}
      <TouchableOpacity 
        style={styles.actionBtn} 
        onPress={() => router.push('/modifier-password')}
        accessibilityRole='button'
        accessibilityLabel='Modifier votre mot de passe'
      >
        <Ionicons name='lock-closed-outline' size={20} color='#2d2d2d' />
        <Text style={styles.actionBtnText}>Modifier le mot de passe</Text>
      </TouchableOpacity>

      {/* RGAA : accessibilityRole + accessibilityLabel pour le bouton de déconnexion */}
      <TouchableOpacity 
        style={styles.btnDanger} 
        onPress={handleLogout}
        accessibilityRole='button'
        accessibilityLabel='Se déconnecter de votre compte'
      >
        <Ionicons name='log-out-outline' size={20} color='white' />
        <Text style={styles.btnDangerText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name='star' size={20} color='#2d2d2d' />
          <Text style={styles.sectionTitre}>Mes favoris ({favoris.length})</Text>
        </View>
        {favoris.map(f => (
          <TouchableOpacity
            key={f.id}
            style={styles.itemCard}
            onPress={() => router.push(`/exercice/${f.exercice.id}`)}
          >
            <View>
              <Text style={styles.itemTitre}>{f.exercice.titre}</Text>
              <View style={styles.itemMeta}>
                <Ionicons name='time-outline' size={13} color='#999' />
                <Text style={styles.itemMetaText}>{f.exercice.duree_secondes}s</Text>
                <Text style={styles.itemMetaText}>{f.exercice.categorie?.nom}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => router.push('/favoris')}>
          <Text style={styles.voirPlus}>Voir tous mes favoris →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Historique complet</Text>
        {historique.map(h => (
          <TouchableOpacity
            key={h.id}
            style={styles.itemCard}
            onPress={() => router.push(`/exercice/${h.exercice.id}`)}
          >
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitre}>{h.exercice.titre}</Text>
                <Text style={styles.itemDate}>{new Date(h.date_realisation).toLocaleDateString()}</Text>
              </View>
              <View style={styles.itemDuree}>
                <Ionicons name='time-outline' size={13} color='#999' />
                <Text style={styles.itemMetaText}>{h.exercice.duree_secondes}s</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => router.push('/historique')}>
          <Text style={styles.voirPlus}>Voir tout l'historique →</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 12,
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
  actionBtn: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e8e4',
  },
  actionBtnText: {
    fontSize: 15,
    color: '#2d2d2d',
  },
  btnDanger: {
    backgroundColor: '#e8405a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDangerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: '#2eaf8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemMetaText: {
    fontSize: 13,
    color: '#999',
  },
  itemDate: {
    fontSize: 13,
    color: '#999',
  },
  itemDuree: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voirPlus: {
    color: '#2eaf8a',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
})