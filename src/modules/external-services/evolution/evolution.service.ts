import { Inject, Injectable } from '@nestjs/common';
import { SendPlainTextData } from './types/request.type';
import { ApiConfig } from '../cal/cal.module';

@Injectable()
export class EvolutionService {
  constructor(@Inject('API_CONFIG') private readonly apiConfig: ApiConfig) {}

  async sendMessage({
    baseUrl,
    data,
    instance,
  }: SendPlainTextData): Promise<any> {
    const endpoint = `https://${baseUrl}/message/sendList/${instance}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apiKey: this.apiConfig.apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
