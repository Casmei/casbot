import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { SendFreeDaysDto } from './dto/send-free-days.dto';

export type DataType = {
  apiKey: string;
  number: string;
  baseUrl: string;
  instance: string;
};

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('send-free-days/:instance')
  sendFreeDays(
    @Body() sendFreeDaysDto: SendFreeDaysDto,
    @Param('instance') instance: string,
  ) {
    return this.scheduleService.sendFreeDays(sendFreeDaysDto, instance);
  }
}
