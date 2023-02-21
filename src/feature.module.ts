import { Module } from '@nestjs/common';
import { InstagramModule } from './instagram/instagram.module';
import { ShopifyModule } from './shopify/shopify.module';

@Module({
  imports: [InstagramModule, ShopifyModule],
  controllers: [],
  providers: [],
})
export class FeatureModule { }
