export interface IItem {
  options: {
    description: string;
    itemStatus?: boolean;
    userAvatar: string;
    token: string;
    username: string;
    title: string;
    userId: any;
    itemId: number;
    type: string;
    userRole?: string;
    setUpdatePage?: any;
  };

  userData?:
    | {
        id: number;
        username: string;
        avatarUrl: string;
        role: { name: string };
      }
    | undefined;

}
