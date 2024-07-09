import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { SendFreeTimeDto } from './send-free-days.dto';

export class SendFreeHoursDto extends PartialType(SendFreeTimeDto) {
  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;
}
