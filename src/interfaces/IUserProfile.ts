export interface IUserProfile {
  token: string;
  userData?:
    | {
        id: number;
        username: string;
        avatarUrl: string;
        role: {
          name: string;
        };
      }
    | undefined;
}
