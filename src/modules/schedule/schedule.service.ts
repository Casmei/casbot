import { Injectable } from '@nestjs/common';
import { CalService } from '../external-services/cal/cal.service';
import * as moment from 'moment-timezone';
import { daysOfWeek, monthsInPortuguese } from './data';
import { EvolutionService } from '../external-services/evolution/evolution.service';
import {
  ListMessage,
  RowListMessage,
} from '../external-services/evolution/types/request.type';
import { SendFreeTimeDto } from './dto/send-free-days.dto';
import { SendFreeHoursDto } from './dto/send-free-hours.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { SlotsResponse } from '../external-services/cal/types/response.types';

export type sendFreeDaysTypes = {
  startTime: string;
  endTime: string;
  eventTypeId: string;
  scheduleBaseUrl: string;
  scheduleApiKey: string;
  baseUrl: string;
  number: string;
  instance: string;
};

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleApi: CalService,
    private readonly evolutionApi: EvolutionService,
  ) {}

  async sendFreeDays(data: SendFreeTimeDto, instance: string) {
    try {
      const { startTime, endTime } = this.calculateDates(7);

      const slots = await this.getFreeHours({
        startTime,
        endTime,
        eventTypeId: data.eventTypeId,
        baseUrl: data.scheduleBaseUrl,
        scheduleBaseUrl: data.scheduleBaseUrl,
        scheduleApiKey: data.scheduleApiKey,
      });

      const nextSixDays = this.nextSixDays(slots);

      const createListMessage = this.createDayListMessage(
        data.number,
        nextSixDays,
      );

      await this.evolutionApi.sendList({
        apiKey: data.messageApiKey,
        baseUrl: data.baseUrl,
        instance: instance,
        data: createListMessage,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async sendFreeHours(data: SendFreeHoursDto, instance: string) {
    try {
      const { startTime, endTime } = this.calculateDates(1, data.startTime);
      const slots = await this.getFreeHours({
        startTime,
        endTime,
        eventTypeId: data.eventTypeId,
        baseUrl: data.scheduleBaseUrl,
        scheduleBaseUrl: data.scheduleBaseUrl,
        scheduleApiKey: data.scheduleApiKey,
      });

      const nextHours = this.nextHours(slots, startTime);

      const createHourListMessage = this.createHourListMessage(
        data.number,
        nextHours,
      );

      await this.evolutionApi.sendList({
        apiKey: data.messageApiKey,
        baseUrl: data.baseUrl,
        instance: instance,
        data: createHourListMessage,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async createAppointment(data: CreateAppointmentDto, instance: string) {
    try {
      await this.scheduleApi.makeAppointment(data);

      const dt = new Date(data.start);

      dt.setHours(dt.getHours() - 3);

      const day = String(dt.getDate()).padStart(2, '0');
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const hour = String(dt.getHours()).padStart(2, '0');
      const minute = String(dt.getMinutes()).padStart(2, '0');
      const formatedDate = `${day}/${month} às ${hour}:${minute}`;

      const message = {
        text: data.message.replace(/!data/, formatedDate),
      };

      await this.evolutionApi.sendPlainMessage({
        apiKey: data.messageApiKey,
        baseUrl: data.messageBaseUrl,
        instance: instance,
        data: {
          number: data.number,
          options: {
            delay: 1200,
            presence: 'composing',
          },
          textMessage: message,
        },
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  calculateDates(
    addDay: number,
    startTime: string | Date = new Date(),
  ): { startTime: string; endTime: string } {
    const start = new Date(startTime);
    const end = new Date(start);

    end.setDate(start.getDate() + addDay);

    return {
      startTime: start.toISOString().slice(0, 10),
      endTime: end.toISOString().slice(0, 10),
    };
  }

  private async getFreeHours(data: Partial<sendFreeDaysTypes>) {
    return this.scheduleApi.getScheduleSlots({
      apiKey: data.scheduleApiKey,
      startTime: data.startTime,
      endTime: data.endTime,
      eventTypeId: data.eventTypeId,
      baseUrl: data.scheduleBaseUrl,
    });
  }

  private nextSixDays({ slots }: SlotsResponse): RowListMessage[] {
    const data = [];

    Object.keys(slots).forEach((date) => {
      const currentDate = moment(date);
      const dayOfWeek = currentDate.day();

      const title = `${daysOfWeek[dayOfWeek]} - ${monthsInPortuguese[currentDate.month()]}`;

      data.push({
        title,
        rowId: date,
      });
    });

    return data;
  }

  private nextHours(
    { slots }: SlotsResponse,
    startTime: string,
  ): RowListMessage[] {
    const data: RowListMessage[] = [];

    slots[startTime].forEach((slot) => {
      const formatedHour = moment(slot.time)
        .tz('America/Sao_Paulo')
        .format('HH:mm');

      data.push({
        title: formatedHour,
        rowId: slot.time,
      });
    });

    return data;
  }

  private createDayListMessage(
    number: string,
    nextSixDays: RowListMessage[],
  ): ListMessage {
    return {
      number,
      options: {
        delay: 1200,
        presence: 'composing',
      },
      listMessage: {
        title: '📅 *Selecione o dia*',
        description:
          'Escolha um dia abaixo 👇🏼\n\nCaso necessário envie *Voltar*',
        buttonText: 'Ver opções',
        sections: [
          {
            title: 'Dias disponíveis',
            rows: [
              {
                title: 'Recomeçar',
                description: 'Voltar para a primeira opção',
                rowId: '0',
              },
              ...nextSixDays,
            ],
          },
        ],
      },
    };
  }

  private createHourListMessage(
    number: string,
    hoursList: RowListMessage[],
  ): ListMessage {
    return {
      number,
      options: {
        delay: 4000,
        presence: 'composing',
      },
      listMessage: {
        title: '🕑 *Selecione a hora desejada*',
        description:
          'Agora só falta escolher um horário 👇🏼\n\nCaso necessário envie *Voltar*',
        buttonText: 'Ver opções',
        sections: [
          {
            title: 'Horários disponíveis',
            rows: [
              {
                title: 'Recomeçar',
                description: 'Voltar para a primeira opção',
                rowId: '0',
              },
              ...hoursList,
            ],
          },
        ],
      },
    };
  }
}
