// NavBarContext.tsx
import { createContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface NavBarContextProps {
  userData: UserData;
  updatePage?: boolean;
  setUpdatePage?: Dispatch<SetStateAction<boolean>>;
}

interface UserData {
  username: string;
  id: number;
  avatarUrl: string;
  role: {
    name: string;
  };
  items: any[]; 
}

const NavBarContext = createContext<any>({});

interface NavBarProviderProps {
  children: ReactNode;
  value: NavBarContextProps;
}

const NavBarProvider: React.FC<NavBarProviderProps> = ({ children, value }) => {
  return <NavBarContext.Provider value={value}>{children}</NavBarContext.Provider>;
};

export { NavBarContext, NavBarProvider };
