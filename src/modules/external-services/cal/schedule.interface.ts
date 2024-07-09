import { AppointmentData } from './types/request.types';
import {
  AppointmentDataResponse,
  AvailableHoursParams,
  SlotsResponse,
} from './types/response.types';

export interface ScheduleApiInterface {
  getScheduleSlots(params: AvailableHoursParams): Promise<SlotsResponse>;
  makeAppointment(body: AppointmentData): Promise<AppointmentDataResponse>;
}
