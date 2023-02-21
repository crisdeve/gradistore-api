import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ShopifyModule } from 'src/shopify/shopify.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [ScheduleModule.forRoot(), ShopifyModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
