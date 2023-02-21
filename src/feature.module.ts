import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ShopifyModule } from './shopify/shopify.module';

@Module({
  imports: [ShopifyModule, ProductsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class FeatureModule {}
