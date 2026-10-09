import axios from 'axios';
import { STUDENT_ID } from '@constants/student';

export const apiClient = axios.create({
    baseURL: 'https://fakestoreapi.com',
    timeout: 10000,
});

apiClient.interceptors.request.use(config => {
    config.headers.set('X-Student-Id', STUDENT_ID);
    return config;
});