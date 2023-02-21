import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { Helpers } from '../utils/helpers';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  last = null;
  constructor(
    private readonly shopifyService: ShopifyService,
    private helper: Helpers,
  ) {}

  @Get(':collectionId')
  async search(
    @Param('collectionId') collectionId: number,
    @Query('order') order: string,
  ) {
    return this.shopifyService.orderingProducts(collectionId);
  }
}
