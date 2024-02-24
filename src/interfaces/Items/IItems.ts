export interface IItems{
    token: string;
    userData: {
        id: number;
        username: string;
        avatarUrl: string;
        role: {
          name: string;
        };
      } | undefined;
      setUpdatePage: any;
      updatePage?: boolean;
}