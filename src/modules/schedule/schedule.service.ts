import { Injectable } from '@nestjs/common';
import { CalService } from '../external-services/cal/cal.service';
import * as moment from 'moment';
import { SlotsResponse } from '../external-services/cal/types/request.types';
import { daysOfWeek, monthsInPortuguese } from './data';
import { EvolutionService } from '../external-services/evolution/evolution.service';
import {
  ListMessage,
  RowListMessage,
} from '../external-services/evolution/types/request.type';
import { SendFreeTimeDto } from './dto/send-free-days.dto';

export type sendFreeDaysTypes = {
  startTime: string;
  endTime: string;
  eventTypeId: string;
  scheduleBaseUrl: string;
  baseUrl: string;
  number: string;
  instance: string;
};

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleApi: CalService,
    private readonly evolutionService: EvolutionService,
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
      });

      const nextSixDays = this.nextSixDays(slots);

      const createListMessage = this.createDayListMessage(
        data.number,
        nextSixDays,
      );

      await this.evolutionService.sendMessage({
        baseUrl: data.baseUrl,
        instance: instance,
        data: createListMessage,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async sendFreeHours(data: SendFreeTimeDto, instance: string) {
    try {
      const { startTime, endTime } = this.calculateDates(1, data.startTime);
      const slots = await this.getFreeHours({
        startTime,
        endTime,
        eventTypeId: data.eventTypeId,
        baseUrl: data.scheduleBaseUrl,
        scheduleBaseUrl: data.scheduleBaseUrl,
      });

      const nextHours = this.nextHours(slots, startTime);

      const createHourListMessage = this.createHourListMessage(
        data.number,
        nextHours,
      );

      await this.evolutionService.sendMessage({
        baseUrl: data.baseUrl,
        instance: instance,
        data: createHourListMessage,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  calculateDates(
    addDay: number,
    startTime?: string,
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
    console.log(startTime, slots);

    slots[startTime].forEach((slot, index) => {
      const date = new Date(slot.time);
      const formatedHour = moment(date).format('HH:mm');

      const title = formatedHour;

      data.push({
        title,
        rowId: (index + 1).toString(),
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
