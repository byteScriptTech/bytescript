/* eslint-disable no-unused-vars */
import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
interface DataItem {
  name: string;
  id: string;
}

interface BreadCrumbContextType {
  data: DataItem[];
  addItem: (item: DataItem) => void;
  removeItem: (id: string) => void;
}

const BreadcrumbContext = createContext<BreadCrumbContextType | undefined>(
  undefined
);

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbContext must be used within a DataProvider');
  }
  return context;
};

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const topicNameArray = searchParams.getAll('name');
  const topicIdArray = searchParams.getAll('id');
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const items = topicNameArray.map((name, index) => ({
      name,
      id: topicIdArray[index],
    }));
    setData(items);
  }, []);
  const addItem = (item: DataItem) => {
    setData((prevData) => {
      if (prevData.length > 1) {
        prevData.splice(1, 1, item);
        return prevData;
      } else {
        return [...prevData, item];
      }
    });
  };

  const removeItem = (id: string) => {
    setData((prevData) => {
      let newData = [];
      for (let i = 0; i < prevData.length; i++) {
        newData.push(prevData[i]);
        if (prevData[i].id === id) {
          return newData;
        }
      }
      return newData;
    });
  };

  return (
    <BreadcrumbContext.Provider value={{ data, addItem, removeItem }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
