import axios from 'axios';
import type { SiteContent } from '../types/siteContent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const siteContentApi = {
  async get(): Promise<SiteContent> {
    const response = await axios.get<SiteContent>(`${API_BASE_URL}/site-content`);
    return response.data;
  }
};