// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import chatReducer from './api/chat/chatSlice';
// import { baseApi } from './api/baseApi';
// import notificationReducer from '../../store/NotificationSlice';
// import './api/registerApi'
// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     chat: chatReducer,
//     [baseApi.reducerPath]: baseApi.reducer,
//     notifications: notificationReducer,
//   },
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware().concat(baseApi.middleware),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// import { configureStore } from '@reduxjs/toolkit';
// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { combineReducers } from 'redux';
// import authReducer from './authSlice';
// import chatReducer from './api/chat/chatSlice';
// import { baseApi } from './api/baseApi';
// import notificationReducer from '../../store/NotificationSlice';
// import './api/registerApi';
// import incompleteRetakeReducer from './features/incompleteRetakeSlice';

// // Redux Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['incompleteRetake'],
// };

// // Combine reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
//   chat: chatReducer,
//   [baseApi.reducerPath]: baseApi.reducer,
//   notifications: notificationReducer,
//   incompleteRetake: incompleteRetakeReducer,
// });

// // Persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Store configuration
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(baseApi.middleware),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
'use client';
import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { storage } from '@/lib/reduxStorage'; // SSR-safe storage (avoids localStorage warning during SSR)
import { combineReducers } from 'redux'; // Ensure reducers are combined
import authReducer from './authSlice';
import chatReducer from './api/chat/chatSlice';
import { baseApi } from './api/baseApi';
import notificationReducer from '../../store/NotificationSlice';
import './api/registerApi';
import incompleteRetakeReducer from './features/incompleteRetakeSlice';
import { persistStore } from 'redux-persist'; // Import persistStore

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // 'incompleteRetake' intentionally removed from whitelist.
  // Answers are stored server-side via /test/answer and restored via useGetTestQuery.
  // Keeping it session-only (in-memory) prevents stale localStorage data
  // from overriding the server's authoritative state on device/browser change.
  whitelist: [],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  [baseApi.reducerPath]: baseApi.reducer, // API reducer
  notifications: notificationReducer,
  incompleteRetake: incompleteRetakeReducer, // Add the incompleteRetake reducer
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware), // Ensure baseApi middleware is included
  devTools: process.env.NODE_ENV !== 'production',
});

// Create the persistor instance
export const persistor = persistStore(store); // This is the persistor you need to export

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
