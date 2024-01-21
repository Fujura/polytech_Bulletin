export interface IModal{
    token: string;
    toggle: () => void;
    modal: boolean;
    itemId: number;
}