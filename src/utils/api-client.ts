import axios from 'axios';
import GeoJsonFeatureCollection from '@/models/GeoJsonFeatureCollection';
import Deed from '@/models/Deed';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default class ApiClient {
  static async getDeeds() {
    const response = await apiClient.get<GeoJsonFeatureCollection>('deeds');
    return response.data;
  }

  static async createDeed(newDeed: Deed) {
    const response = await apiClient.post<Deed>('deeds', newDeed);
    return response.data;
  }
}
