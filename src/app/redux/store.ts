import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './api/chat/chatSlice';
import { baseApi } from './api/baseApi';
import notificationReducer from '../../store/NotificationSlice';
import './api/registerApi'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    notifications: notificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
