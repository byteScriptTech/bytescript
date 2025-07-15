import { useRouter } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbContext } from '@/context/BreadCrumbContext';

interface Topic {
  name: string;
  id: string;
}

interface LearnScreenBreadCrumbProps {
  className?: string;
}

const LearnScreenBreadCrumb: React.FC<LearnScreenBreadCrumbProps> = ({
  className = '',
}) => {
  const { data, removeItem } = useBreadcrumbContext();
  const router = useRouter();
  const datalen = data?.length || 0;

  const removeBreadcrumbItem = async (item: Topic) => {
    try {
      await router.push(`/learn?name=${item.name}&id=${item.id}`);
      removeItem(item.id);
    } catch (error) {
      console.error('Error removing breadcrumb item:', error);
    }
  };

  const getBreadcrumb = (data: Topic[]) => {
    return (
      data?.map((item: Topic, i: number) => {
        return (
          <React.Fragment key={item.id}>
            <BreadcrumbItem className="cursor-pointer">
              {datalen - 1 === i ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={() => removeBreadcrumbItem(item)}
                  className="cursor-pointer hover:text-primary"
                  data-testid={`breadcrumb-${item.id}`}
                >
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i < datalen - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        );
      }) || null
    );
  };
  return (
    <Breadcrumb className={`${className} hidden md:flex`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="cursor-pointer hover:text-primary"
            onClick={() => router.push('/dashboard')}
            data-testid="dashboard-link"
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {getBreadcrumb(data)}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default LearnScreenBreadCrumb;
