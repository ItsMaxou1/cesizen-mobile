import { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

interface Exercice {
  id: number
  titre: string
  inspiration: number
  apnee: number
  expiration: number
  duree_secondes: number
}

export default function LancerExercicePage() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [exercice, setExercice] = useState<Exercice | null>(null)
  const [phase, setPhase] = useState<'inspiration' | 'apnee' | 'expiration'>('inspiration')
  const [compteur, setCompteur] = useState(0)
  const [actif, setActif] = useState(false)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://10.0.2.2:3001/api/exercices/${id}`)
      const data = await res.json()
      setExercice(data)
      setCompteur(data.inspiration)
    }
    load()
  }, [id])

  useEffect(() => {
    if (!actif || !exercice) return

    intervalRef.current = setInterval(() => {
      setCompteur(prev => {
        if (prev <= 1) {
          if (phase === 'inspiration') {
            setPhase('apnee')
            return exercice.apnee || exercice.expiration
          } else if (phase === 'apnee') {
            setPhase('expiration')
            return exercice.expiration
          } else {
            setPhase('inspiration')
            return exercice.inspiration
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [actif, phase, exercice])

  const handleStart = () => setActif(true)
  const handleStop = () => {
    setActif(false)
    clearInterval(intervalRef.current)
  }

  const phaseLabel = () => {
    if (phase === 'inspiration') return 'Inspirez'
    if (phase === 'apnee') return 'Retenez'
    return 'Expirez'
  }

  const phaseColor = () => {
    if (phase === 'inspiration') return '#2eaf8a'
    if (phase === 'apnee') return '#F5F0C8'
    return '#7ECECA'
  }

  if (!exercice) return <View><Text>Chargement...</Text></View>

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>{exercice.titre}</Text>

      <View style={[styles.cercle, { backgroundColor: phaseColor() }]}>
        <Text style={styles.phase}>{phaseLabel()}</Text>
        <Text style={styles.compteur}>{compteur}</Text>
      </View>

      <View style={styles.btns}>
        {!actif ? (
          <TouchableOpacity style={styles.btn} onPress={handleStart}>
            <Text style={styles.btnText}>Démarrer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.btnStop]} onPress={handleStop}>
            <Text style={styles.btnText}>Arrêter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0', padding: 16, alignItems: 'center', justifyContent: 'center' },
  retour: { position: 'absolute', top: 16, left: 16 },
  retourText: { color: '#2eaf8a', fontSize: 16 },
  titre: { fontSize: 22, fontWeight: 'bold', marginBottom: 48, color: '#2d2d2d' },
  cercle: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 48 },
  phase: { fontSize: 20, fontWeight: 'bold', color: '#2d2d2d', marginBottom: 8 },
  compteur: { fontSize: 48, fontWeight: 'bold', color: '#2d2d2d' },
  btns: { flexDirection: 'row', gap: 16 },
  btn: { backgroundColor: '#2eaf8a', padding: 16, borderRadius: 12, paddingHorizontal: 32 },
  btnStop: { backgroundColor: '#e8405a' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
})