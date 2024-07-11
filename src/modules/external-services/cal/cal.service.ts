import { Injectable, Inject } from '@nestjs/common';
import { ScheduleApiInterface } from './schedule.interface';
import { AppointmentData, AvailableHoursParams } from './types/request.types';
import { ApiConfig } from '../evolution/evolution.module';
import { AppointmentDataResponse, SlotsResponse } from './types/response.types';

@Injectable()
export class CalService implements ScheduleApiInterface {
  async getScheduleSlots(params: AvailableHoursParams): Promise<SlotsResponse> {
    const url = `https://${params.baseUrl}/v1/slots?apiKey=${params.apiKey}&startTime=${params.startTime}&endTime=${params.endTime}&eventTypeId=${params.eventTypeId}`;
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

  async makeAppointment(
    data: AppointmentData,
  ): Promise<AppointmentDataResponse> {
    try {
      data.eventTypeId = Number(data.eventTypeId)
      const url = `https://${data.baseUrl}/v1/bookings?apiKey=${data.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) as AppointmentDataResponse;
    } catch (error) {}
  }
}
