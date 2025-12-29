import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { LanguageContent } from '@/types/content';

interface ScrollToListItem {
  id: string;
  views: { name: string; id: string }[];
}

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Content'],
  endpoints: (builder) => ({
    getContent: builder.query<LanguageContent[], string>({
      queryFn: async (topicName) => {
        try {
          const cachedContent = localStorage.getItem(`content_${topicName}`);
          if (cachedContent) {
            return { data: JSON.parse(cachedContent) };
          }

          const coursesContentCollection = collection(
            db,
            topicName || 'default'
          );
          const courseContentSnapshot = await getDocs(coursesContentCollection);
          const courseContentList = courseContentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as LanguageContent[];

          localStorage.setItem(
            `content_${topicName}`,
            JSON.stringify(courseContentList)
          );
          return { data: courseContentList };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['Content'],
    }),
    getScrollToList: builder.query<ScrollToListItem[], void>({
      queryFn: async () => {
        try {
          const cachedScrollToList = localStorage.getItem('scrollToList');
          if (cachedScrollToList) {
            return { data: JSON.parse(cachedScrollToList) };
          }

          const scrollToListCollection = collection(db, 'scroll_to_view');
          const scrollToViewSnapshot = await getDocs(scrollToListCollection);
          const scrollToList = scrollToViewSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ScrollToListItem[];

          localStorage.setItem('scrollToList', JSON.stringify(scrollToList));
          return { data: scrollToList };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['Content'],
    }),
  }),
});

export const { useGetContentQuery, useGetScrollToListQuery } = contentApi;
