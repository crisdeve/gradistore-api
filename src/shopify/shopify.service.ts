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
              id
              title
    					metafields(first: 10) {
                nodes {
                  key
                  value
                }
              }
              products(first: 200) {
                nodes {
                  id
                  title 
                  vendor
                  totalInventory
                  tracksInventory
                  priceRangeV2 {          
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                    minVariantPrice {
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
}
