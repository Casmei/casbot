import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CalModule } from '../external-services/cal/cal.module';
import { EvolutionModule } from '../external-services/evolution/evolution.module';

@Module({
  imports: [
    CalModule.registerAsync({
      useFactory: async () => ({
        apiKey: 'cal_live_3de31f43143669bce486cce878cfbf4b',
      }),
    }),
    EvolutionModule.registerAsync({
      useFactory: async () => ({
        apiKey: 'wfbq8tfdvfd9qyb0ezxak',
      }),
    }),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
