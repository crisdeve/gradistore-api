import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { Helpers } from '../utils/helpers';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ShopifyController],
  providers: [ShopifyService, Helpers],
  exports: [ShopifyService],
})
export class ShopifyModule {}
