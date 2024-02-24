import axios from 'axios';
import { FetchDataServiceParams } from '../interfaces/IFetchDataService';



export const fetchDataService = async (params: FetchDataServiceParams): Promise<void> => {
    const { method, url, headers, data, states } = params;
    states.setLoading(true);
    
    try {
        let response;
        if (method === 'get') {
            response = await axios.get(url, { headers });            
        } else {
            response = await axios.request({
                method,
                url,
                headers,
                data,
            });
            console.log(2);
            
        }


        if (states.setData) {
            states.setData(response.data);
            
            
        }

        states.setLoading(false);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        states.setLoading(false);
    }
};