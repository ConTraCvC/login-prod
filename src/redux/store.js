import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import persistReducer from 'redux-persist/es/persistReducer'
import { resetPSToken } from './resetPSToken'

const reducer1 = combineReducers({
  user: userSlice.reducer,
  rsToken: resetPSToken.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
};

const persistData = persistReducer(persistConfig, reducer1);

const store = configureStore({
  reducer: persistData,
  devTools: process.env.NODE_ENV !== 'dev',
  middleware: [thunk]
})

export default store