export type AvailableHoursParams = {
  startTime: string;
  endTime: string;
  eventTypeId: string;
  baseUrl: string;
  apiKey: string;
};

type Location = {
  value: string;
  optionValue?: string;
};

type Responses = {
  name: string;
  email: string;
  location: Location;
  notes?: string;
  guests: any[];
};

export type AppointmentData = {
  baseUrl: string;
  apiKey: string;
  responses: Responses;
  user: string;
  start: string;
  eventTypeId: string | number;
  eventTypeSlug: string;
  timeZone: string;
  language: string;
  metadata: Record<string, any>;
  hasHashedBookingLink: boolean;
};
