import axios from 'axios';

interface iService {
  method?: string;
  url: string;
  headers?: object;
  params?: object;
  payload?: object;
}

const ApiResource = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const service = axios.create({
    baseURL: `${baseURL}`,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_CLIENT,
      'Content-Type': 'application/json'
      // 'Authorization': 'Basic parole',
    }
  });

  service.interceptors.request.use(config => {
    return config;
  });

  service.interceptors.response.use(
    (response: any) => {
      // console.log({ response })
      return response.data;
    },

    (error: any) => {
      if (error?.code === 'ERR_NETWORK') {
        // showToast('Check your internet connection.', 'failed');
      }

      if (
        error?.response?.status === 401 &&
        error?.response?.data?.action === 'please_login'
      ) {
        window.history.pushState({}, '', '/auth/logout');
        window.history.go(0);
      }

      if (error?.response?.status === 401 && error?.response?.data?.action === 'auto_login') {
        window.history.pushState({}, '', '/auth/logout');
        window.history.go(0);
      }

      return Promise.reject(error?.response?.data);
    }
  );

  return {
    get: async (url: string, params?: any) => {
      try {
        const data = service.get(url, { params });
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    _get: async ({ url, params, headers }: iService) => {
      try {
        const data = service.get(url, { headers, params });
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    post: async ({ url, payload }: iService) => {
      try {
        const data = service.post(url, payload);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    patch: async ({ url, payload }: iService) => {
      try {
        const data = service.patch(url, payload);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    delete: async ({ url, payload }: iService) => {
      try {
        const data = service.delete(url, payload);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    put: async ({ url, payload }: iService) => {
      try {
        const data = await service.put(url, payload);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    retry: async ({ method, url, payload }: iService) => {
      try {
        const data = service({
          method: method,
          url: url,
          data: payload
        });
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
};

export const Request = ApiResource();
