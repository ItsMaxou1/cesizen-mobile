import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import LoginPage from '../../app/login'

const mockLogin = jest.fn()
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('../../src/context/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockReset()
    mockLogin.mockReset()
    mockPush.mockReset()
    mockReplace.mockReset()
  })

  it('connecte l utilisateur puis redirige vers l accueil', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          id: 1,
          email: 'test@cesizen.fr',
          nom: 'Martin',
          prenom: 'Julie',
          role: 'user',
        },
        token: 'token-test',
      }),
    })

    const { getByPlaceholderText, getByText } = render(<LoginPage />)
    const submitButton = getByText('Se connecter').parent

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@cesizen.fr')
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'motdepasse')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(mockLogin).toHaveBeenCalledWith(
        {
          id: 1,
          email: 'test@cesizen.fr',
          nom: 'Martin',
          prenom: 'Julie',
          role: 'user',
        },
        'token-test'
      )
      expect(mockReplace).toHaveBeenCalledWith('/')
    })
  })

  it('affiche un message d erreur si la connexion echoue', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Identifiants invalides',
      }),
    })

    const { getByPlaceholderText, getByText, findByText } = render(<LoginPage />)
    const submitButton = getByText('Se connecter').parent

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@cesizen.fr')
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'mauvais')
    fireEvent.press(submitButton)

    expect(await findByText('Identifiants invalides')).toBeTruthy()
    expect(mockLogin).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})