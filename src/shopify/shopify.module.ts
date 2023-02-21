import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { Helpers } from '../utils/helpers';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ShopifyController],
  providers: [ShopifyService, Helpers, CronService],
  exports: [ShopifyService],
})
export class ShopifyModule {}
