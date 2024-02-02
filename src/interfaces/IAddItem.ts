import { Dispatch, SetStateAction } from "react";

export interface IAddItem{
    setUpdatePage: Dispatch<SetStateAction<boolean>>;
    userData:
    | {
        id: number;
        username: string;
        avatarUrl: string;
        role: { name: string };
        items?: any[] | undefined
      }
    | undefined;
}