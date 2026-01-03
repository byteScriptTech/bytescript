import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authSlice } from './slices/authSlice';
import { contentApi } from './slices/contentSlice';
import { customTestsApi } from './slices/customTestsSlice';
import { dsaTopicsApi } from './slices/dsaTopicsSlice';
import { javascriptApi } from './slices/javascriptSlice';
import { languagesApi } from './slices/languagesSlice';
import { notesApi } from './slices/notesSlice';
import { patternsApi } from './slices/patternsSlice';
import { practiceQuestionsApi } from './slices/practiceQuestionsSlice';
import { practiceTopicsApi } from './slices/practiceTopicsSlice';
import { problemsApi } from './slices/problemsSlice';
import timerSlice from './slices/timerSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    timer: timerSlice,
    [notesApi.reducerPath]: notesApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
    [dsaTopicsApi.reducerPath]: dsaTopicsApi.reducer,
    [javascriptApi.reducerPath]: javascriptApi.reducer,
    [patternsApi.reducerPath]: patternsApi.reducer,
    [practiceQuestionsApi.reducerPath]: practiceQuestionsApi.reducer,
    [practiceTopicsApi.reducerPath]: practiceTopicsApi.reducer,
    [problemsApi.reducerPath]: problemsApi.reducer,
    [customTestsApi.reducerPath]: customTestsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.currentUser.proactiveRefresh'],
      },
    })
      .concat(notesApi.middleware)
      .concat(contentApi.middleware)
      .concat(languagesApi.middleware)
      .concat(dsaTopicsApi.middleware)
      .concat(javascriptApi.middleware)
      .concat(patternsApi.middleware)
      .concat(practiceQuestionsApi.middleware)
      .concat(practiceTopicsApi.middleware)
      .concat(problemsApi.middleware)
      .concat(customTestsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
