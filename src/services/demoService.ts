import { api } from './api';

// Demo service showing different ways to use the interceptor
export class DemoService {
  
  // GET request with query parameters
  static async getDataWithParams(params: { page: number; limit: number }) {
    try {
      const response = await api.get('/demo/data', { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }

  // POST request with JSON data
  static async createData(data: any) {
    try {
      const response = await api.post('/demo/data', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create data');
    }
  }

  // PUT request to update data
  static async updateData(id: string, data: any) {
    try {
      const response = await api.put(`/demo/data/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update data');
    }
  }

  // DELETE request
  static async deleteData(id: string) {
    try {
      await api.delete(`/demo/data/${id}`);
    } catch (error) {
      throw new Error('Failed to delete data');
    }
  }

  // PATCH request for partial updates
  static async patchData(id: string, data: any) {
    try {
      const response = await api.patch(`/demo/data/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to patch data');
    }
  }

  // File upload with FormData
  static async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/demo/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  }

  // Request with custom headers (interceptor will still add token)
  static async getDataWithCustomHeaders() {
    try {
      const response = await api.get('/demo/data', {
        headers: {
          'X-Custom-Header': 'custom-value',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data with custom headers');
    }
  }

  // Request with timeout override
  static async getDataWithTimeout(timeout: number) {
    try {
      const response = await api.get('/demo/data', {
        timeout,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data with timeout');
    }
  }

  // Request that doesn't require authentication (public endpoint)
  static async getPublicData() {
    try {
      // Create a new axios instance without interceptors for public endpoints
      const publicApi = api.create();
      const response = await publicApi.get('/demo/public');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch public data');
    }
  }
} 