import { Body, Controller, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { SendFreeTimeDto } from './dto/send-free-days.dto';
import { SendFreeHoursDto } from './dto/send-free-hours.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

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
    @Body() sendFreeDaysDto: SendFreeTimeDto,
    @Param('instance') instance: string,
  ) {
    return this.scheduleService.sendFreeDays(sendFreeDaysDto, instance);
  }

  @Post('send-free-hours/:instance')
  sendFreeHours(
    @Body() sendFreeDaysDto: SendFreeHoursDto,
    @Param('instance') instance: string,
  ) {
    return this.scheduleService.sendFreeHours(sendFreeDaysDto, instance);
  }

  @Post('appointment')
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    console.log(createAppointmentDto);
    this.scheduleService.createAppointment(createAppointmentDto);
  }
}
