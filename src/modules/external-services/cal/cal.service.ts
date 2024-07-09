import { Injectable, Inject } from '@nestjs/common';
import { ScheduleApiInterface } from './schedule.interface';
import { AvailableHoursParams, SlotsResponse } from './types/request.types';
import { ApiConfig } from '../evolution/evolution.module';

@Injectable()
export class CalService implements ScheduleApiInterface {
  constructor(@Inject('API_CONFIG') private readonly apiConfig: ApiConfig) {}

  async getScheduleSlots(params: AvailableHoursParams): Promise<SlotsResponse> {
    const url = `https://${params.baseUrl}/v1/slots?apiKey=${this.apiConfig.apiKey}&startTime=${params.startTime}&endTime=${params.endTime}&eventTypeId=${params.eventTypeId}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as SlotsResponse;
  }
}
