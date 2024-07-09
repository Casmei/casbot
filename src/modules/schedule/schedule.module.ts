import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CalModule } from '../external-services/cal/cal.module';
import { EvolutionModule } from '../external-services/evolution/evolution.module';

@Module({
  imports: [CalModule, EvolutionModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
