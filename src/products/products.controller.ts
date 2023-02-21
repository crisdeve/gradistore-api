import { Controller, Get } from '@nestjs/common';
import { ShopifyService } from 'src/shopify/shopify.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get('all')
  async getAllProducts() {
    const products = await this.shopifyService.getProductsByCollection(
      439164502326,
    );
    return products;
  }
}
