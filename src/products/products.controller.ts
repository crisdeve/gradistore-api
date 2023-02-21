import { Controller, Get, } from '@nestjs/common';
import { ShopifyService } from 'src/shopify/shopify.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly shopifyService: ShopifyService,
  ) {}

  @Get('all')
  async getAllProducts() {
    return 'products'
  }
}
