'use client';

import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import {
  useGetContentQuery,
  useGetScrollToListQuery,
} from '@/store/slices/contentSlice';
import { LanguageContent } from '@/types/content';

interface ScrollToListItem {
  views: { name: string; id: string }[];
  id: string;
}

export const useContentRedux = (topicName: string = '') => {
  const [localTopicName, setLocalTopicName] = useState(topicName);

  const {
    data: content = [],
    isLoading: contentLoading,
    error: contentError,
  } = useGetContentQuery(localTopicName);

  const {
    data: scrollToList = [],
    isLoading: scrollLoading,
    error: scrollError,
  } = useGetScrollToListQuery();

  const fetchContent = debounce((newTopicName: string) => {
    setLocalTopicName(newTopicName);
  }, 300);

  useEffect(() => {
    fetchContent(topicName);
  }, [topicName, fetchContent]);

  return {
    content,
    fetchContent: (newTopicName: string) => fetchContent(newTopicName),
    loading: contentLoading || scrollLoading,
    error: contentError || scrollError,
    scrollToList,
  };
};
