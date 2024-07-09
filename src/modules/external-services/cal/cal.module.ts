import { Module, DynamicModule } from '@nestjs/common';
import { CalService } from './cal.service';

export interface ApiConfig {
  apiKey: string;
}

@Module({
  providers: [CalService],
  exports: [CalService],
})
export class CalModule {}
