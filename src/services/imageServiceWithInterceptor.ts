import { api } from './api';

// Types for image search
export interface ImageResult {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  likes: number;
  created_at: string;
}

export interface SearchResponse {
  results: ImageResult[];
  total: number;
  total_pages: number;
}

// Image search service using Axios Interceptor
export class ImageServiceWithInterceptor {
  private static accessKey = 'HejXqxAwSCYJP4-zOYha60alnTJSSBt9rd3JSPYVwjs';

  // Search images using Axios Interceptor
  static async searchImages(keyword: string, page: number = 1, perPage: number = 12): Promise<SearchResponse> {
    try {
      console.log('🔍 Searching images with keyword:', keyword);
      
      // Using Axios with interceptor - token will be added automatically
      const response = await api.get('/search/photos', {
        params: {
          page,
          query: keyword,
          client_id: this.accessKey,
          per_page: perPage
        }
      });

      console.log('✅ Search successful, found', response.data.results.length, 'images');
      
      return {
        results: response.data.results,
        total: response.data.total,
        total_pages: response.data.total_pages
      };
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw new Error('Failed to search images');
    }
  }

  // Get random images using Axios Interceptor
  static async getRandomImages(count: number = 12): Promise<ImageResult[]> {
    try {
      console.log('🎲 Getting random images, count:', count);
      
      // Using Axios with interceptor
      const response = await api.get('/photos/random', {
        params: {
          client_id: this.accessKey,
          count
        }
      });

      console.log('✅ Random images fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get random images:', error);
      throw new Error('Failed to get random images');
    }
  }

  // Get trending images using Axios Interceptor
  static async getTrendingImages(page: number = 1, perPage: number = 12): Promise<SearchResponse> {
    try {
      console.log('🔥 Getting trending images');
      
      // Using Axios with interceptor
      const response = await api.get('/photos', {
        params: {
          page,
          per_page: perPage,
          client_id: this.accessKey,
          order_by: 'popular'
        }
      });

      console.log('✅ Trending images fetched successfully');
      
      return {
        results: response.data,
        total: response.data.length,
        total_pages: Math.ceil(response.data.length / perPage)
      };
    } catch (error) {
      console.error('❌ Failed to get trending images:', error);
      throw new Error('Failed to get trending images');
    }
  }

  // Download image using Axios Interceptor
  static async downloadImage(imageId: string): Promise<void> {
    try {
      console.log('⬇️ Downloading image:', imageId);
      
      // Using Axios with interceptor
      const response = await api.get(`/photos/${imageId}/download`, {
        params: {
          client_id: this.accessKey
        }
      });

      console.log('✅ Download triggered successfully');
      
      // Trigger download
      const link = document.createElement('a');
      link.href = response.data.url;
      link.download = `image-${imageId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('❌ Failed to download image:', error);
      throw new Error('Failed to download image');
    }
  }

  // Get image details using Axios Interceptor
  static async getImageDetails(imageId: string): Promise<ImageResult> {
    try {
      console.log('📋 Getting image details:', imageId);
      
      // Using Axios with interceptor
      const response = await api.get(`/photos/${imageId}`, {
        params: {
          client_id: this.accessKey
        }
      });

      console.log('✅ Image details fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get image details:', error);
      throw new Error('Failed to get image details');
    }
  }
} 