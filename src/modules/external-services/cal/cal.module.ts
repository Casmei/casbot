import { Module, DynamicModule } from '@nestjs/common';
import { CalService } from './cal.service';

export interface ApiConfig {
  apiKey: string;
}

@Module({})
export class CalModule {
  static registerAsync(options: {
    useFactory: () => Promise<ApiConfig> | ApiConfig;
  }): DynamicModule {
    return {
      module: CalModule,
      providers: [
        {
          provide: 'API_CONFIG',
          useFactory: options.useFactory,
        },
        CalService,
      ],
      exports: [CalService],
    };
  }
}
