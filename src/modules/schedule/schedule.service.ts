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
import { SendFreeDaysDto } from './dto/send-free-days.dto';

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

  async sendFreeDays(data: SendFreeDaysDto, instance: string) {
    try {
      const { startTime, endTime } = this.calculateDates();
      const slots = await this.getFreeHours({
        startTime,
        endTime,
        eventTypeId: data.eventTypeId,
        baseUrl: data.scheduleBaseUrl,
        scheduleBaseUrl: data.scheduleBaseUrl,
      });

      const nextSixDays = this.nextSixDays(slots);

      const createListMessage = this.createListMessage(
        data.number,
        nextSixDays,
      );

      await this.evolutionService.sendMessage({
        baseUrl: data.baseUrl,
        instance: instance,
        data: createListMessage,
      });

      return nextSixDays;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  calculateDates(): { startTime: string; endTime: string } {
    const startTime = new Date();
    const endTime = new Date(startTime);

    endTime.setDate(startTime.getDate() + 7);

    return {
      startTime: startTime.toISOString().slice(0, 10),
      endTime: endTime.toISOString().slice(0, 10),
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

  private createListMessage(
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
}
