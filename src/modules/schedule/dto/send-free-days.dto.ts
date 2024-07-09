import { IsString, IsNotEmpty } from 'class-validator';

export class SendFreeDaysDto {
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
}
