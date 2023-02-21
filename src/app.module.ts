import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig } from './config/app.config';
import { FeatureModule } from './feature.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        //The first environment to be loaded will be the one that is loaded
        'environments/.env.development',
      ],
      load: [EnvConfig],
      isGlobal: true,
    }),
    FeatureModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
