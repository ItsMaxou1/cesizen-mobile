global.fetch = jest.fn()

jest.mock('@expo/vector-icons', () => {
  const React = require('react')

  return {
    Ionicons: (props: any) => React.createElement('Ionicons', props),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})