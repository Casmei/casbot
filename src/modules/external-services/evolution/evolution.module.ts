import { Module, DynamicModule } from '@nestjs/common';
import { EvolutionService } from './evolution.service';

export interface ApiConfig {
  apiKey: string;
}

@Module({})
export class EvolutionModule {
  static registerAsync(options: {
    useFactory: () => Promise<ApiConfig> | ApiConfig;
  }): DynamicModule {
    return {
      module: EvolutionModule,
      providers: [
        {
          provide: 'API_CONFIG',
          useFactory: options.useFactory,
        },
        EvolutionService,
      ],
      exports: [EvolutionService],
    };
  }
}
