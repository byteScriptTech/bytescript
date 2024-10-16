import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useBreadcrumbContext } from '@/context/BreadCrumbContext';

type Topic = {
  id: string;
  name: string;
};
interface NavigationProps {
  topics?: Topic[];
  ctid: string | undefined;
  setCurrentTopic: (topic: Topic) => void;
  loading: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  topics,
  ctid,
  setCurrentTopic,
  loading,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, addItem } = useBreadcrumbContext();

  useEffect(() => {
    const datalen = data && data.length;
    if (datalen) {
      data[datalen - 1] && setCurrentTopic(data[data.length - 1]);
    }
  }, [data]);

  const handleTopicClick = (topic: Topic) => {
    const name = searchParams.get('name');
    const id = searchParams.get('id');
    router.push(
      `${pathname}?name=${name}&id=${id}&name=${topic.name}&id=${topic.id}`
    );

    setCurrentTopic(topic);
    addItem(topic);
  };

  return (
    <nav className="grid gap-4 h-[calc(100vh-30vh)] text-sm text-muted-foreground overflow-y-auto custom-scrollbar">
      {loading && <Skeleton className="h-100 w-full" />}
      {topics?.map((topic) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleTopicClick(topic)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTopicClick(topic);
            }
          }}
          className={ctid === topic.id ? 'font-semibold text-primary' : ''}
          key={topic.id}
        >
          {topic.name}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
