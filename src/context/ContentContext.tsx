import { collection, getDocs } from 'firebase/firestore/lite';
import { useSearchParams } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { LanguageContent } from '@/types/content';

import { db } from '../../lib/firebase';

interface LanguagesContextProps {
  content: LanguageContent[] | undefined;
  fetchContent: () => Promise<void>;
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

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const topicNameArray = searchParams.getAll('name');
  const [content, setContent] = useState<LanguageContent[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollToList, setScrollToList] = useState<
    { views: { name: string; id: string }[]; id: string }[]
  >([]);
  const topicName = topicNameArray[0];
  const fetchContent = async () => {
    setLoading(true);
    try {
      const coursesContentCollection = collection(db, topicName);
      const courseContentSnapshot = await getDocs(coursesContentCollection);
      const courseContentList = courseContentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;
      setContent(courseContentList);
    } catch (error) {
      console.error('Error fetching course content: ', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchScrollToViewList = async () => {
    try {
      const scrollToListCollection = collection(db, 'scroll_to_view');
      const scrollToViewSnapshot = await getDocs(scrollToListCollection);
      const scrollToList = scrollToViewSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;
      setScrollToList(scrollToList);
    } catch (error) {
      console.error('Error fetching course content: ', error);
    }
  };
  useEffect(() => {
    fetchContent();
    fetchScrollToViewList();
  }, []);

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
