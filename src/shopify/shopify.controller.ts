import { Controller, Get, Param } from '@nestjs/common';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  last = null;
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get(':collectionId')
  async search(@Param('collectionId') collectionId: number) {
    return this.shopifyService.getProductsByCollection(collectionId);
  }
}
