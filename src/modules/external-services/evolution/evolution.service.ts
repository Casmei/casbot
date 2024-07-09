import { Injectable } from '@nestjs/common';
import { SendPlainTextData } from './types/request.type';

@Injectable()
export class EvolutionService {
  async sendMessage({
    baseUrl,
    data,
    apiKey,
    instance,
  }: SendPlainTextData): Promise<any> {
    const endpoint = `https://${baseUrl}/message/sendList/${instance}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
