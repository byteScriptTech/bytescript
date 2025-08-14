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

interface BreadcrumbProviderProps {
  children: React.ReactNode;
  topicNames?: string[];
  topicIds?: string[];
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
  topicNames = [],
  topicIds = [],
}) => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const items = topicNames.map((name, index) => ({
      name,
      id: topicIds[index] || '',
    }));
    setData(items);
  }, [topicNames, topicIds]);
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
