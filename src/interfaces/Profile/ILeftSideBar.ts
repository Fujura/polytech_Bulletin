export interface ILeftSideBar {
  options: {
    userData: any;
    setShowLeftBar: (show: boolean) => void;
    showLeftBar: boolean;
    token: string;
    setUserUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogout: () => void;
  };
}
