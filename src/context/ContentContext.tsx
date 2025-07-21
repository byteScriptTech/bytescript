import { collection, getDocs } from 'firebase/firestore';
import { debounce } from 'lodash';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { db } from '@/firebase/config';
import { LanguageContent } from '@/types/content';

interface LanguagesContextProps {
  content: LanguageContent[] | undefined;
  fetchContent: (topicName: string) => void;
  loading: boolean;
  scrollToList: { views: { name: string; id: string }[]; id: string }[];
}

const ContentContext = createContext<LanguagesContextProps | undefined>(
  undefined
);

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
  topicName?: string;
}

export const ContentProvider = ({
  children,
  topicName,
}: ContentProviderProps) => {
  const [content, setContent] = useState<LanguageContent[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollToList, setScrollToList] = useState<
    { views: { name: string; id: string }[]; id: string }[]
  >([]);

  const getDataFromLocalStorage = (key: string) => {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  };

  const saveDataToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const fetchContent = debounce(async (topicName: string) => {
    setLoading(true);

    const cachedContent = getDataFromLocalStorage(`content_${topicName}`);
    if (cachedContent) {
      setContent(cachedContent);
      setLoading(false);
      return;
    }

    try {
      const coursesContentCollection = collection(db, topicName || 'default');
      const courseContentSnapshot = await getDocs(coursesContentCollection);
      const courseContentList = courseContentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;

      saveDataToLocalStorage(`content_${topicName}`, courseContentList);
      setContent(courseContentList);
    } catch (error) {
      console.error('Error fetching course content: ', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const fetchScrollToViewList = debounce(async () => {
    const storedScrollToList = getDataFromLocalStorage('scrollToList');
    if (storedScrollToList) {
      setScrollToList(storedScrollToList);
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'scrollToViewList'));
      const scrollToViewData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        views: doc.data().views || [],
      }));
      setScrollToList(scrollToViewData);
    } catch (error) {
      console.error('Error fetching scroll to view list:', error);
    }
  }, 300);

  useEffect(() => {
    fetchScrollToViewList();
    if (topicName) {
      fetchContent(topicName);
    }
  }, [topicName, fetchContent, fetchScrollToViewList]);

  return (
    <ContentContext.Provider
      value={{
        content,
        fetchContent,
        scrollToList,
        loading,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
