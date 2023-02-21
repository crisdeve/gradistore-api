import { Controller, Get } from '@nestjs/common';
import { ShopifyService } from 'src/shopify/shopify.service';

@Controller('products')
export class OrdersController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get()
  async getAllProducts() {
    return 'orders';
  }
}
