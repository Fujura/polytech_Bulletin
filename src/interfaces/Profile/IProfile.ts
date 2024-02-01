export interface IProfile {
  token: string;
  removeCookie: any;
  userData?:
  | {
      id: number;
      username: string;
      avatarUrl: string;
      role: { name: string };
      items?: any[]
    }
  | undefined;
  setUpdatePage: any;
}
