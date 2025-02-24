import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SetLeds, SetWifi } from './lab1.dto';

@Injectable()
export class Lab1Api {
  private readonly API_URL = 'http://192.168.1.208/';

  async setLeds(param: SetLeds): Promise<any> {
    try {
      const response = await axios.post(
        this.API_URL + 'set-leds',
        {
          leds: param.leds.map((u) => {
            return u.status === 'on' ? 1 : 0;
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      return response.data;
    } catch (error) {
      console.error('API call failed:', error.message);
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  async setWifi(param: SetWifi): Promise<any> {
    try {
      const response = await axios.post(
        (param.connect ? this.API_URL : 'http://192.168.4.1/') + 'set-wifi',
        { ssid: param.ssid, password: param.password },
        { headers: { 'Content-Type': 'application/json' } },
      );

      return response.data;
    } catch (error) {
      console.error('API call failed:', error.message);
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  async resetWifi(): Promise<any> {
    try {
      const response = await axios.post(
        this.API_URL + 'reset-wifi',
        {},
        { headers: { 'Content-Type': 'application/json' } },
      );

      console.log('ESP32 Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API call failed:', error.message);
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  async status(): Promise<any> {
    try {
      const response = await axios.get(this.API_URL + 'wifi-status', {
        timeout: 5000,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('API call timeout');
        return { status: 'off' };
      }

      console.error('API call failed:', error.message);
      throw new Error(`API call failed: ${error.message}`);
    }
  }
}
