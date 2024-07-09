import { AvailableHoursParams, SlotsResponse } from './types/response.types';

export interface ScheduleApiInterface {
  getScheduleSlots(params: AvailableHoursParams): Promise<SlotsResponse>;
}
