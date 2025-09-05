import axios from 'axios';

type CacheEntry = {
  data: any;
  timestamp: number;
};

const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'd2qp5ahr01qluccpepagd2qp5ahr01qluccpepb0';

class ApiService {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTtlMs = 30 * 1000;
  private finnhubClient = axios.create({
    baseURL: 'https://finnhub.io/api/v1',
    headers: {
      'X-Finnhub-Token': FINNHUB_API_KEY,
    },
  });

  async testApiConnection(url: string): Promise<{ success: boolean; fields?: string[]; error?: string }> {
    try {
      const response = await axios.get(url);
      const fields = this.extractTopLevelFields(response.data);
      return { success: true, fields };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async fetchData(url: string, ttlMs: number = this.defaultTtlMs): Promise<any> {
    const now = Date.now();
    const cached = this.cache.get(url);
    if (cached && now - cached.timestamp < ttlMs) {
      return cached.data;
    }
    try {
      const response = await axios.get(url);
      const data = response.data;
      this.cache.set(url, { data, timestamp: now });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`);
    }
  }

  async fetchStockData(symbol: string): Promise<any> {
    try {
      const response = await this.finnhubClient.get(`/quote?symbol=${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchCryptoData(symbol: string): Promise<any> {
    try {
      const response = await this.finnhubClient.get(`/crypto/candle?symbol=${symbol}&resolution=D&from=${Math.floor(Date.now() / 1000) - 86400}&to=${Math.floor(Date.now() / 1000)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch crypto data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchCompanyProfile(symbol: string): Promise<any> {
    try {
      const response = await this.finnhubClient.get(`/stock/profile2?symbol=${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch company profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractTopLevelFields(obj: any, prefix = ''): string[] {
    const fields: string[] = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        fields.push(fieldPath);
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          fields.push(...this.extractTopLevelFields(obj[key], fieldPath));
        }
      }
    }
    
    return fields;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiService = new ApiService();
export default apiService;
