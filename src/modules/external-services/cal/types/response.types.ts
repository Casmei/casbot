export type AvailableHoursParams = {
  startTime: string;
  endTime: string;
  eventTypeId: string;
  baseUrl: string;
};

interface TimeSlot {
  time: string;
}

interface Slots {
  [date: string]: TimeSlot[];
}

export interface SlotsResponse {
  slots: Slots;
}

type Location = {
  value: string;
  optionValue: string;
};

type User = {
  email: string | null;
  name: string;
  timeZone: string;
  username: string;
};

type Reference = {
  type: string;
  uid: string;
  thirdPartyRecurringEventId: string | null;
  meetingId: string;
  meetingPassword: string;
  meetingUrl: string;
  externalCalendarId: string;
  credentialId: number;
};

type AppStatus = {
  appName: string;
  type: string;
  success: number;
  failures: number;
  errors: string[];
  warnings: string[];
};

type Responses = {
  name: string;
  email: string;
  notes: string;
  guests: any[];
  location: Location;
};

export type AppointmentDataResponse = {
  id: number;
  uid: string;
  idempotencyKey: string;
  userId: number;
  userPrimaryEmail: string;
  eventTypeId: number;
  title: string;
  description: string;
  customInputs: Record<string, any>;
  responses: Responses;
  startTime: string;
  endTime: string;
  location: string;
  createdAt: string;
  updatedAt: string | null;
  status: string;
  paid: boolean;
  destinationCalendarId: number;
  cancellationReason: string | null;
  rejectionReason: string | null;
  dynamicEventSlugRef: string | null;
  dynamicGroupSlugRef: string | null;
  rescheduled: string | null;
  fromReschedule: string | null;
  recurringEventId: string | null;
  smsReminderNumber: string | null;
  scheduledJobs: any[];
  metadata: Record<string, any>;
  isRecorded: boolean;
  iCalUID: string;
  iCalSequence: number;
  rating: number | null;
  ratingFeedback: string | null;
  noShowHost: boolean | null;
  user: User;
  attendees: {
    id: number;
    email: string;
    name: string;
    timeZone: string;
    locale: string;
    bookingId: number;
    noShow: boolean;
  }[];
  payment: any[];
  references: Reference[];
  appsStatus: AppStatus[];
  paymentRequired: boolean;
  luckyUsers: any[];
};
