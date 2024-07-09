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

// private async getAvailableHours(data: { startTime: string, endTime: string, eventTypeId: string, apiKey: string, baseUrl: string }) {
//   const url = `https://${data.baseUrl}/v1/slots?apiKey=${data.apiKey}&startTime=${data.startTime}&endTime=${data.endTime}&eventTypeId=${data.eventTypeId}`;
//   console.log(url)
//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return await response.json();
// }
