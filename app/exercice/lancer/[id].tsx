import { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { API_URL } from '../../../src/config'
import { useAuth } from '../../../src/context/useAuth'

interface Exercice {
  id: number
  titre: string
  inspiration: number
  apnee: number
  expiration: number
  duree_secondes: number
  type: string
}

export default function LancerExercicePage() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [exercice, setExercice] = useState<Exercice | null>(null)
  const [phase, setPhase] = useState<'inspiration' | 'apnee' | 'expiration'>('inspiration')
  const [compteur, setCompteur] = useState(0)
  const [actif, setActif] = useState(false)
  const [secondesEcoulees, setSecondesEcoulees] = useState(0)
  const [termine, setTermine] = useState(false)
  const intervalRef = useRef<any>(null)
  const barreAnim = useRef(new Animated.Value(0)).current
  const bulleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/api/exercices/${id}`)
      const data = await res.json()
      setExercice(data)
      setCompteur(data.inspiration)
    }
    load()
  }, [id])

  useEffect(() => {
    if (!actif || !exercice) return

    if (exercice.type === 'barre') {
      const duree = phase === 'inspiration' ? exercice.inspiration : phase === 'apnee' ? exercice.apnee || 1 : exercice.expiration
      Animated.timing(barreAnim, {
        toValue: phase === 'inspiration' ? 1 : phase === 'apnee' ? 1 : 0,
        duration: duree * 1000,
        useNativeDriver: false,
      }).start()
    } else {
      const duree = phase === 'inspiration' ? exercice.inspiration : phase === 'apnee' ? exercice.apnee || 1 : exercice.expiration
      Animated.timing(bulleAnim, {
        toValue: phase === 'inspiration' ? 1.4 : phase === 'apnee' ? 1.4 : 0.8,
        duration: duree * 1000,
        useNativeDriver: true,
      }).start()
    }

    intervalRef.current = setInterval(() => {
      setSecondesEcoulees(prev => {
        const next = prev + 1
        if (next >= exercice.duree_secondes) {
          clearInterval(intervalRef.current)
          setActif(false)
          setTermine(true)
          return exercice.duree_secondes
        }
        return next
      })

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

  const handleStart = () => {
    setActif(true)
    setTermine(false)
    setSecondesEcoulees(0)
    setPhase('inspiration')
    if (exercice) setCompteur(exercice.inspiration)
  }

  const handleStop = () => {
    setActif(false)
    setTermine(false)
    setSecondesEcoulees(0)
    clearInterval(intervalRef.current)
    barreAnim.setValue(0)
    bulleAnim.setValue(1)
  }

  const handleFinish = () => {
    router.back()
  }

  const phaseLabel = () => {
    if (phase === 'inspiration') return 'Inspirez'
    if (phase === 'apnee') return 'Retenez'
    return 'Expirez'
  }

  const phaseColor = () => {
    if (phase === 'inspiration') return '#2eaf8a'
    if (phase === 'apnee') return '#F5C842'
    return '#7ECECA'
  }

  if (!user) return <View><Text>Redirection vers la connexion...</Text></View>

  if (!exercice) return <View><Text>Chargement...</Text></View>

  const progression = Math.min(100, Math.round((secondesEcoulees / exercice.duree_secondes) * 100))

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>{exercice.titre}</Text>
      {termine ? (
        <View style={styles.finContainer}>
          <Text style={styles.finTitle}>Exercice terminé</Text>
          <Text style={styles.finText}>Bravo, vous avez complété toute la session.</Text>
          <TouchableOpacity style={styles.btn} onPress={handleFinish}>
            <Text style={styles.btnText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progression}%` }]} />
            </View>
            <Text style={styles.progressText}>{progression}%</Text>
          </View>

          <Text style={styles.phaseLabel}>{phaseLabel()}</Text>
          <Text style={styles.compteur}>{compteur}</Text>

          {exercice.type === 'barre' ? (
            <View style={styles.barreContainer}>
              <Animated.View style={[
                styles.barre,
                {
                  width: barreAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: phaseColor()
                }
              ]} />
            </View>
          ) : (
            <Animated.View style={[
              styles.bulle,
              {
                backgroundColor: phaseColor(),
                transform: [{ scale: bulleAnim }]
              }
            ]} />
          )}

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
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retour: {
    position: 'absolute',
    top: 48,
    left: 16,
  },
  retourText: {
    color: '#2eaf8a',
    fontSize: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2d2d2d',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#dce7e1',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2eaf8a',
  },
  progressText: {
    marginTop: 8,
    textAlign: 'right',
    color: '#2d2d2d',
    fontWeight: '600',
  },
  phaseLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  compteur: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 48,
  },
  bulle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 48,
  },
  barreContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e8e4',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 48,
  },
  barre: {
    height: '100%',
    borderRadius: 10,
  },
  btns: {
    flexDirection: 'row',
    gap: 16,
  },
  btn: {
    backgroundColor: '#2eaf8a',
    padding: 16,
    borderRadius: 12,
    paddingHorizontal: 32,
  },
  btnStop: {
    backgroundColor: '#e8405a',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#eaf6f0',
    borderRadius: 16,
    padding: 24,
  },
  finTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  finText: {
    fontSize: 16,
    color: '#41534c',
    textAlign: 'center',
    marginBottom: 8,
  },
})