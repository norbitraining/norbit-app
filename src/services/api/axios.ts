import axios from 'axios';
import {API_PATH} from 'env';

const instance = axios.create({
  baseURL: API_PATH,
  timeout: 90000,
});
export default instance;
