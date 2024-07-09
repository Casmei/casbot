import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendFreeTimeDto {
  @IsString()
  @IsNotEmpty()
  scheduleBaseUrl: string;

  @IsString()
  @IsNotEmpty()
  scheduleApiKey: string;

  @IsString()
  @IsNotEmpty()
  eventTypeId: string;

  @IsString()
  @IsNotEmpty()
  baseUrl: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;
}
