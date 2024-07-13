class LocationDto {
  value: string;
  optionValue?: string;
}

class ResponsesDto {
  name: string;
  email: string;
  location: LocationDto;
  notes?: string;
  guests: any[];
}

export class CreateAppointmentDto {
  baseUrl: string;
  messageApiKey: string;
  messageBaseUrl: string;
  message: string;
  number: string;
  apiKey: string;
  responses: ResponsesDto;
  user: string;
  start: string;
  eventTypeId: string;
  eventTypeSlug: string;
  timeZone: string;
  language: string;
  metadata: Record<string, any>;
  hasHashedBookingLink: boolean;
}
