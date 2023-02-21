import { Injectable, NotFoundException } from '@nestjs/common';
import { Shopify, DataType, LATEST_API_VERSION } from '@shopify/shopify-api';
import axios, { AxiosRequestConfig } from 'axios';
import { Helpers } from '../utils/helpers';

@Injectable()
export class ShopifyService {
  private shopify;
  private themeId;

  constructor(private helper: Helpers) {}

  /**
   * Initialize the configuration for the store, in order to be able to manage the store information
   * @author: Luis Avila
   */
  async setting() {
    this.shopify = new Shopify.Clients.Rest(
      process.env.SHOPIFY_STORE,
      process.env.SHOPIFY_TOKEN,
    );
  }

  /**
   * Initialize the configuration for the store, in order to be able to manage the store information
   * @author: Luis Avila
   */
  async settingQL() {
    this.shopify = new Shopify.Clients.Graphql(
      process.env.SHOPIFY_STORE,
      process.env.SHOPIFY_TOKEN,
    );
  }

  /**
   * create or update metafields at store level
   * @param payload
   * @returns object
   */
  async createMetaFields(payload) {
    try {
      this.setting();
      const metafield = await this.shopify.post({
        path: `metafields`,
        data: {
          metafield: {
            namespace: payload.namespace,
            key: payload.key,
            value: payload.data,
            type: payload.type,
          },
        },
        type: DataType.JSON,
      });
      return metafield.body.metafield;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  /**
   * access metafields fields by nanespace and key
   * @param payload
   * @returns object
   */
  async getMetafield(payload: { namespace: string; key: string }) {
    try {
      this.setting();
      const metafield = await this.shopify.get({
        path: `metafields`,
        query: {
          namespace: payload.namespace,
          key: payload.key,
        },
        type: DataType.JSON,
      });
      return metafield.body.metafields[0];
    } catch (error) {
      return {
        error: error.message,
      };
    }
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

  /**
   * grouping of actions to sort products at the server level
   * @param collectionId 
   * @param order 
   * @returns object 
   */
  async orderingProducts(collectionId: number) {
    const data = await this.getProductsByCollection(collectionId);

    if (!data) {
      throw new NotFoundException('Collection not found');
    }
    const { metafields, products } = data;

    const initData = {
      metafields: metafields?.nodes,
      products: products?.nodes,
    };
    const sortedData = this.helper.sortProducts(initData);
    return sortedData;
  }

  /**
   * list of collection IDs
   * @returns object
   */
  async getIdsCollection() {
    try {
      this.settingQL();
      const collections = await this.shopify.query({
        data: {
          query: `query {
            collections(first: 100) {
              nodes {
                id
              }
            }
          }`,
        },
      });
      if (!collections?.body?.data) {
        return {
          error: true,
          message: '',
        };
      }
      return collections?.body?.data?.collections?.nodes;
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  /**
   * changing the order of products in a collection
   * @param collectionId 
   * @param moves | object new order
   * @returns object 
   */
  async setOrderProductsByCollection(collectionId, moves) {
    try {
      this.settingQL();
      const info = {
        collectionId,
        moves,
      };

      const response = await this.shopify.query({
        data: {
          query: `mutation setOrder($collectionId: ID!, $moves: [MoveInput!]!) {
             collectionReorderProducts(id: $collectionId, moves: $moves) {
              job {
                id
              }
              userErrors {
                field
                message
              }
            }
          }`,
          variables: { ...info },
          operationName: 'setOrder',
        },
      });
      //console.log('----->>>', response.body.data.collectionReorderProducts);
      return {
        success: true,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
