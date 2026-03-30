import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

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

export default function ExercicesPage() {
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [categorieFiltre, setCategorieFiltre] = useState('Tous')
  const [categories, setCategories] = useState<string[]>(['Tous'])
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const res = await fetch('http://10.176.137.120:3001/api/exercices')
      const data = await res.json()
      setExercices(data)
      const cats = ['Tous', ...new Set<string>(data.map((ex: Exercice) => ex.categorie.nom))]
      setCategories(cats)
    }
    load()
  }, [])

  const filtres = categorieFiltre === 'Tous' ? exercices : exercices.filter(ex => ex.categorie.nom === categorieFiltre)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Exercices de respiration</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtres}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtre, categorieFiltre === cat && styles.filtreActif]}
            onPress={() => setCategorieFiltre(cat)}
          >
            <Text style={[styles.filtreText, categorieFiltre === cat && styles.filtreTextActif]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtres.map(ex => (
        <TouchableOpacity key={ex.id} style={styles.card} onPress={() => router.push(`/exercice/${ex.id}`)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitre}>{ex.titre}</Text>
          </View>
          <Text style={styles.cardSub}>{ex.duree_secondes}s • {ex.categorie.nom}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f0', 
    padding: 16 
  },
  titre: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#2d2d2d' 
  },
  filtres: { 
    marginBottom: 16 
  },
  filtre: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#2eaf8a', 
    marginRight: 8 
  },
  filtreActif: { 
    backgroundColor: '#2eaf8a' 
  },
  filtreText: { 
    color: '#2eaf8a', 
    fontSize: 14 
  },
  filtreTextActif: { 
    color: 'white' 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 8, 
    elevation: 2 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  cardTitre: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2d2d2d' 
  },
  cardSub: { 
    fontSize: 13, 
    color: '#666' 
  },
})