import { AxiosRequestConfig } from "axios";

export interface FetchDataServiceParams {
    method: 'get' | 'post' | 'put' | 'delete' | string;
    url: string;
    headers?: AxiosRequestConfig['headers'] | any;
    data?: any;
    states: {
        setData: React.Dispatch<React.SetStateAction<any>>; 
        setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    };
}