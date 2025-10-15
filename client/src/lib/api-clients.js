
import axios from 'axios';
import { HOST } from '../utils/constants';

const apiClients = axios.create({
    baseURL: HOST,
    withCredentials:true
})

export default apiClients;