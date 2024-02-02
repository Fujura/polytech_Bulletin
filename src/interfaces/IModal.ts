export interface IModal{
    token: string;
    toggle: () => void;
    modal: boolean;
    itemId: number;
    userData:
    | {
        id: number;
        username: string;
        avatarUrl: string;
        role: { name: string };
        items?: any[]
      }
    | undefined;
}