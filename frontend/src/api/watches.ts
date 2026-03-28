import { apiClient } from './client';
import type { Watch, WatchCreate } from '../types/watch';

export const watchesApi = {
  getAll: async () => (await apiClient.get<Watch[]>('/watches')).data,
  getById: async (id: number) => (await apiClient.get<Watch>(`/watches/${id}`)).data,
  create: async (data: WatchCreate) => (await apiClient.post<Watch>('/watches', data)).data,
  update: async (id: number, data: WatchCreate) => (await apiClient.put<Watch>(`/watches/${id}`, data)).data,
  remove: async (id: number) => {
    await apiClient.delete(`/watches/${id}`);
  }
};
