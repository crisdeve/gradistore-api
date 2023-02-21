import { Controller, Get } from '@nestjs/common';
import { ShopifyService } from 'src/shopify/shopify.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get()
  async getAllProducts() {
    const orders = await this.shopifyService.getAllOrders();
    return orders;
  }
}
