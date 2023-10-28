import axios from './axios';
import {BEARER_TOKEN_NAME} from 'utils/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {log} from 'utils';

export const VERSION = 'v1';
export const BEARER_TOKEN = '';

class Api {
  get = async (uri: string, data = null): Promise<any> => {
    try {
      log('-------------Get Url----------', JSON.stringify(uri));
      const headers = await this.getHeaders();
      const result = await axios.get(uri, {headers, params: data});
      return result.data;
    } catch (e: any) {
      if (e.response?.status === 401) {
        try {
          await this.postNewToken();
          return this.get(uri);
        } catch (ex) {
          return Promise.reject(ex);
        }
      }
      throw e;
    }
  };

  delete = async (uri: string): Promise<any> => {
    try {
      const headers = await this.getHeaders();
      const result = await axios.delete(uri, {headers});
      return result.data;
    } catch (e: any) {
      if (e.response?.status === 401) {
        try {
          await this.postNewToken();
          return this.delete(uri);
        } catch (ex) {
          return Promise.reject(ex);
        }
      }
      throw e;
    }
  };

  put = async (uri: string, body: any): Promise<any> => {
    const headers = await this.getHeaders();
    try {
      const {data} = await axios.put(uri, body, {
        headers,
      });
      return data;
    } catch (e: any) {
      if (e.response?.status === 401) {
        try {
          await this.postNewToken();
          return this.put(uri, body);
        } catch (ex) {
          return Promise.reject(ex);
        }
      }
      throw e;
    }
  };

  patch = async (uri: string, body: any): Promise<any> => {
    const headers = await this.getHeaders();
    try {
      const {data} = await axios.patch(uri, body, {
        headers,
      });

      return data;
    } catch (e: any) {
      if (e.response?.status === 401) {
        try {
          await this.postNewToken();
          return this.patch(uri, body);
        } catch (ex) {
          return Promise.reject(ex);
        }
      }
      throw e;
    }
  };

  post = async (uri: string, body: any): Promise<any> => {
    const headers = await this.getHeaders();
    try {
      const {data} = await axios.post(uri, body, {
        headers,
      });
      return data;
    } catch (e: any) {
      log('-------------Post ERROR----------', JSON.stringify(e));
      if (e.response?.status === 401) {
        try {
          await this.postNewToken();
          return this.post(uri, body);
        } catch (ex) {
          return Promise.reject(ex);
        }
      }
      throw e;
    }
  };

  postNewToken = async () => {
    const headers = await this.getHeaders();
    log('-------------Post Refresh----------', headers);
    try {
      const {data} = await axios.get(`/${VERSION}/user/refresh`, {headers});
      this.setAuthorization(data.token);
      return data;
    } catch (e: any) {
      log('-------------Post Refresh ERROR----------', JSON.stringify(e));
      throw {e, isEndSession: true};
    }
  };

  isJson = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  setAuthorization = (authorization: string) => {
    try {
      AsyncStorage.setItem(BEARER_TOKEN_NAME, authorization);
    } catch (e) {}
  };

  getAuthorization = () => {
    try {
      return AsyncStorage.getItem(BEARER_TOKEN_NAME);
    } catch (e) {}

    return null;
  };

  getHeaders = async () => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    };

    const authorization = await this.getAuthorization();
    if (authorization !== null) {
      headers.Authorization = `Bearer ${authorization}`;
    }
    return headers;
  };
}

export default new Api();
