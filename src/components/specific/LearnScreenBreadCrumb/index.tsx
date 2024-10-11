import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbContext } from '@/context/BreadCrumbContext';

interface Topic {
  name: string;
  id: string;
}
interface LearnScreenBreadCrumbProps {}
const LearnScreenBreadCrumb: React.FC<LearnScreenBreadCrumbProps> = () => {
  const { data, removeItem } = useBreadcrumbContext();
  const datalen = data && data.length;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeBreadcrumbItem = (item: Topic) => {
    const name = searchParams.get('name');
    const id = searchParams.get('id');
    router.push(`${pathname}?name=${name}&id=${id}`);
    removeItem(item.id);
  };

  const getBreadcrumb = (data: Topic[]) => {
    return data.map((item: Topic, i: number) => {
      return (
        <React.Fragment key={item.id}>
          <BreadcrumbItem className="cursor-pointer">
            {datalen - 1 === i ? (
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => removeBreadcrumbItem(item)}
                className="cursor-pointer"
              >
                {item.name}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {i < datalen - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      );
    });
  };
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="dashboard">Dashborad</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {getBreadcrumb(data)}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default LearnScreenBreadCrumb;
