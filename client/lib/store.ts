import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({user: userReducer})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
}

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
  })

export const makeStore = () => {
  const isServer = typeof window === 'undefined'
  if (isServer) {
    return makeConfiguredStore()
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer)
    let store: any = configureStore({
      reducer: persistedReducer,
    })
    store.__persistor = persistStore(store)
    return store
  }
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']