import { Injectable } from '@nestjs/common';
import { Shopify } from '@shopify/shopify-api';
import { Helpers } from '../utils/helpers';

@Injectable()
export class ShopifyService {
  private shopify;

  constructor(private helper: Helpers) {}

  /**
   * Initialize the configuration for the store, in order to be able to manage the store information
   * @author: Luis Avila
   */
  private async setting() {
    this.shopify = new Shopify.Clients.Rest(
      process.env.SHOPIFY_STORE,
      process.env.SHOPIFY_TOKEN,
    );
  }

  /**
   * Initialize the configuration for the store, in order to be able to manage the store information
   * @author: Luis Avila
   */
  private async settingQL() {
    this.shopify = new Shopify.Clients.Graphql(
      process.env.SHOPIFY_STORE,
      process.env.SHOPIFY_TOKEN,
    );
  }

  /**
   * consult the products of a collection
   * @param collectionId
   * @returns object
   */
  async getProductsByCollection(collectionId: number) {
    try {
      this.settingQL();
      const product = await this.shopify.query({
        data: {
          query: `query {
            collection(id: "gid://shopify/Collection/${collectionId}") {
              products(first: 200) {
                nodes {
                  id
                  title 
                  tags
                  totalInventory
                  tracksInventory
                  prices: priceRangeV2 {          
                    max: maxVariantPrice {
                      amount
                      currencyCode
                    }
                    min: minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }`,
        },
      });
      if (!product?.body?.data) {
        return {
          error: true,
          message: '',
        };
      }
      return product?.body?.data.collection;
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  /**
   * consult the products of a collection
   * @param collectionId
   * @returns object
   */
  async getAllOrders() {
    try {
      this.settingQL();
      const orders = await this.shopify.query({
        data: {
          query: `query {
            orders(first: 10) {
              nodes {
                id
                email          
                lineItems(first: 10) {
                  nodes {
                    id
                    title
                    quantity
                    image {
                      url
                      altText
                    }
                    total: originalTotalSet {
                      shopMoney {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }`,
        },
      });
      if (!orders?.body?.data) {
        return {
          error: true,
          message: '',
        };
      }
      return orders?.body?.data;
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  }
}
