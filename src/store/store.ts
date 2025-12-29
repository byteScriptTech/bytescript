import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authSlice } from './slices/authSlice';
import { contentApi } from './slices/contentSlice';
import { languagesApi } from './slices/languagesSlice';
import { notesApi } from './slices/notesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(notesApi.middleware)
      .concat(contentApi.middleware)
      .concat(languagesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
