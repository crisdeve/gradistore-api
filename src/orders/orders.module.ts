import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ShopifyModule } from 'src/shopify/shopify.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [ScheduleModule.forRoot(), ShopifyModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
