import React, { ReactElement, useContext, useState } from "react";
interface StorageContextType {
  storage: string | null;
  setStorage: (storage: string | null) => void;
}

const StorageContext = React.createContext<StorageContextType>({
  storage: null,
  setStorage: () => {},
});

export const useStorage: () => [
  string | null,
  (storage: string | null) => void
] = () => {
  const { storage, setStorage } = useContext(StorageContext);
  return [storage, setStorage];
};

export const StorageContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [storage, setStorage] = useState(localStorage.getItem("auth"));

  return (
    <StorageContext.Provider value={{ storage, setStorage }}>
      {children}
    </StorageContext.Provider>
  );
};
