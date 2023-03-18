import axios from 'axios';
import {HTTP_SERVER_UNAVAILABLE, BEARER_TOKEN_NAME} from 'utils/constants/api';
import ENV from 'config/env';
import AsyncStorage from '@react-native-community/async-storage';

export const BASE_API = ENV.API_PATH;
export const VERSION = 'v1';
export const BEARER_TOKEN = '';

class Api {
  async get(uri: string, data = null): Promise<any> {
    const url = `${BASE_API}${uri}`;
    try {
      const headers = await this.getHeaders();
      console.log('-------------Get Url----------', JSON.stringify(url));
      const result = await axios.get(url, {headers, params: data});
      console.log('-------------Response----------');
      return result.data;
    } catch (e: any) {
      //   if (e.response?.status === 401) {
      //     try {
      //       // await this.postToken(null, true);
      //       return this.get(uri);
      //     } catch (ex) {
      //       return Promise.reject(ex);
      //     }
      //   }
      throw e;
    }
  }

  async delete(uri: string): Promise<any> {
    const url = `${BASE_API}${uri}`;
    try {
      const headers = await this.getHeaders();
      const result = await axios.delete(url, {headers});
      return result.data;
    } catch (e: any) {
      //   if (e.response?.status === 401) {
      //     try {
      //       // await this.postToken(null, true);
      //       return this.delete(uri);
      //     } catch (ex) {
      //       return Promise.reject(ex);
      //     }
      //   }
      return e.response?.status;
    }
  }

  async put(uri: string, body: any, returnRequest = false) {
    const headers = await this.getHeaders();
    try {
      const request = await axios.put(`${BASE_API}${uri}`, body, {
        headers,
      });
      if (returnRequest) {
        return request;
      }
      try {
        if (request.status === 500) {
          return Promise.reject({code: HTTP_SERVER_UNAVAILABLE});
        }
        const response = await request.data;
        return response;
      } catch (e) {
        return request;
      }
    } catch (e: any) {
      //   if (e.response?.status === 401) {
      //     try {
      //       // await this.postToken(null, true);
      //       return this.put(uri);
      //     } catch (ex) {
      //       return Promise.reject(ex);
      //     }
      //   }
      return e.response?.status;
    }
  }

  async patch(uri: string, body: any): Promise<any> {
    const headers = await this.getHeaders();
    try {
      const request = await axios.patch(`${BASE_API}${uri}`, body, {
        headers,
      });

      try {
        if (request.status === 500) {
          return Promise.reject({code: HTTP_SERVER_UNAVAILABLE});
        }
        const response = await request.data;
        return response;
      } catch (e) {
        return request;
      }
    } catch (e: any) {
      //   if (e.response?.status === 401) {
      //     try {
      //       // await this.postToken(null, true);
      //       return this.patch(uri, body);
      //     } catch (ex) {
      //       return Promise.reject(ex);
      //     }
      //   }
      return e.response?.status;
    }
  }

  async post(uri: string, body: any, returnRequest = false): Promise<any> {
    const headers = await this.getHeaders();
    const url = `${BASE_API}${uri}`;
    try {
      console.log('-------------Post Url----------', url);
      const request = await axios.post(url, body, {
        headers,
      });
      if (returnRequest) {
        return request;
      }

      const response = await request.data;
      return response;
    } catch (e: any) {
      console.log('-------------Post ERROR----------', JSON.stringify(e));
      /*if (e.response?.status === 401) {
        try {
          // await this.postToken(null, true);
          return this.post(uri, body);
        } catch (ex) {
          return Promise.reject(ex);
        }
      }*/
      throw e;
    }
  }

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

  async getHeaders() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    };

    const authorization = this.getAuthorization();
    if (authorization !== null) {
      headers.Authorization = `Bearer ${authorization}`;
    }

    return headers;
  }
}

export default new Api();
