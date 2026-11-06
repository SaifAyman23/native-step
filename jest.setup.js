jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'))
jest.mock('react-native-reanimated/src/ReanimatedModule', () => ({
  ReanimatedModule: {
    setCSSEventHandler: () => {},
    setDynamicFeatureFlag: () => {},
    getStaticFeatureFlag: () => false,
    getViewProp: () => Promise.resolve(undefined),
    setViewStyle: () => {},
    markNodeAsRemovable: () => {},
    unmarkNodeAsRemovable: () => {},
  },
  ReanimatedModuleProxy: {},
}))
jest.mock('react-native-gesture-handler', () => {
  const React = require('react')
  const { View, ScrollView } = require('react-native')
  const chain = new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === 'enabled') {
          return () => chain
        }
        if (typeof prop === 'string') {
          return () => chain
        }
        return undefined
      },
    }
  )
  const Gesture = new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop === 'string') {
          return () => chain
        }
        return undefined
      },
    }
  )
  const GestureHandlerRootView = (props) => props.children
  const GestureDetector = (props) => props.children
  return {
    __esModule: true,
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
    ScrollView,
  }
})
