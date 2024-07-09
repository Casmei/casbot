import { Module, DynamicModule } from '@nestjs/common';
import { EvolutionService } from './evolution.service';

export interface ApiConfig {
  apiKey: string;
}

@Module({
  providers: [EvolutionService],
  exports: [EvolutionService],
})
export class EvolutionModule {}
