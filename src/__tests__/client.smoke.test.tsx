import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import LoginPage from '../../app/login'
import ProfilPage from '../../app/(tabs)/profil'

const mockPush = jest.fn()

jest.mock('../../src/context/useAuth', () => ({
  useAuth: () => ({
    user: null,
    token: null,
    logout: jest.fn(),
    login: jest.fn(),
  }),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

describe('Parcours client smoke', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  it('affiche les ecrans essentiels sans crash pour un visiteur', () => {
    const loginScreen = render(<LoginPage />)
    expect(loginScreen.getByText('Connexion')).toBeTruthy()
    expect(loginScreen.getByText("Pas de compte ? S'inscrire")).toBeTruthy()

    const profilScreen = render(<ProfilPage />)
    expect(profilScreen.getByText('Mon Profil')).toBeTruthy()
    expect(profilScreen.getByText('Connectez-vous pour accéder à votre profil')).toBeTruthy()
    expect(profilScreen.getByText('Se connecter')).toBeTruthy()
    expect(profilScreen.getByText('Créer un compte')).toBeTruthy()
  })

  it('redirige le visiteur vers les ecrans de connexion et inscription depuis le profil', () => {
    const { getByText } = render(<ProfilPage />)

    fireEvent.press(getByText('Se connecter'))
    expect(mockPush).toHaveBeenCalledWith('/login')

    fireEvent.press(getByText('Créer un compte'))
    expect(mockPush).toHaveBeenCalledWith('/register')
  })
})