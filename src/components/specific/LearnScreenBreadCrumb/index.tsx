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

interface dataType {
  name: string;
  id: string;
}
interface LearnScreenBreadCrumbProps {}
const LearnScreenBreadCrumb: React.FC<LearnScreenBreadCrumbProps> = () => {
  const { data, removeItem } = useBreadcrumbContext();
  const datalen = data && data.length;

  const getBreadcrumb = (data: dataType[]) => {
    return data.map((item: dataType, i: number) => {
      return (
        <React.Fragment key={item.id}>
          <BreadcrumbItem className="cursor-pointer">
            {datalen - 1 === i ? (
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => removeItem(item.id)}
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
