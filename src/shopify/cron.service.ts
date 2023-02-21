import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShopifyService } from './shopify.service';

@Injectable()
export class CronService {
  constructor(private readonly shopifyService: ShopifyService) {}

  //@Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateOrderProducts() {
    const data = await this.shopifyService.getIdsCollection();
    console.log('cron shopify');
    for (const item of data) {
      const collectionId = item.id;
      const order = [];
      let it = 0;
      const dataCollection = await this.shopifyService.orderingProducts(
        item.id.replace('gid://shopify/Collection/', ''),
      );

      for (const product of dataCollection) {
        it++;
        const setOrder = { id: product.id, newPosition: it.toString() };
        order.push(setOrder);
      }
      if (collectionId && order.length) {
        await this.shopifyService.setOrderProductsByCollection(
          collectionId,
          order,
        );
      }
    }
  }
}
