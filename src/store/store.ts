import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authSlice } from './slices/authSlice';
import { contentApi } from './slices/contentSlice';
import { dsaTopicsApi } from './slices/dsaTopicsSlice';
import { languagesApi } from './slices/languagesSlice';
import { notesApi } from './slices/notesSlice';
import { practiceQuestionsApi } from './slices/practiceQuestionsSlice';
import timerSlice from './slices/timerSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    timer: timerSlice,
    [notesApi.reducerPath]: notesApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
    [dsaTopicsApi.reducerPath]: dsaTopicsApi.reducer,
    [practiceQuestionsApi.reducerPath]: practiceQuestionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(notesApi.middleware)
      .concat(contentApi.middleware)
      .concat(languagesApi.middleware)
      .concat(dsaTopicsApi.middleware)
      .concat(practiceQuestionsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
