import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';

@Injectable()
export class Helpers {
  /**
   * generate the date by a specific separator, with the possibility of having the time
   * @param isDatetime
   * @param separator
   * @author: Luis Avila
   * @returns string datetime
   */
  getDateTime(isDatetime = true, separator = '/') {
    const date = new Date();
    const month = date.getMonth() + 1;
    const monthstr = month < 10 ? `0${month}` : month;
    const day = date.getUTCDate();
    const daystr = day < 10 ? `0${day}` : day;
    const time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    if (isDatetime) {
      return `${date.getFullYear()}${separator}${monthstr}${separator}${daystr} ${time}`;
    } else {
      return `${date.getFullYear()}${separator}${monthstr}${separator}${daystr}`;
    }
  }

  /**
   * generate a string with the date to create discount codes in shopify
   * @param length | strin random size
   * @author: Luis Avila
   * @returns string
   */
  getStrinCode(length = 8) {
    const date = this.getDateTime(false, '');
    let code = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const prefix = process.env.SHOPIFY_PREFIX || 'APP';
    const result = prefix + date + code;
    return result.toUpperCase();
  }

  countInObject(dataObjec) {
    for (const index in dataObjec) {
      const data = dataObjec[index];
      const items = data.questions.length;
      dataObjec[index]['totalQuestions'] = items;
    }
    return dataObjec;
  }

  /**
   * extract the last word of a string
   * @param string
   * @returns string
   */
  getColor(string) {
    const words = string.split(' ');
    return words[words.length - 1];
  }
  /**
   * generate an ordering of the information
   * @param data
   * @param order
   * @returns
   */
  sortProducts = (data) => {
    if (!data.metafields && !data.products) {
      return [];
    }
    const metafields = data.metafields;
    const products = data.products;

    const sortCriteria = [];
    metafields.forEach((metafield) => {
      if (metafield.value === 'true') {
        sortCriteria.push(metafield.key);
      }
    });

    return this.compareFunction(products, sortCriteria);
  };

  /**
   * generate 3 levels of management
   * @param a | previous object to be evaluated
   * @param b | next item to be evaluated
   * @param sortCriteria
   * @returns object
   */
  compareFunction = (products, sortCriteria) => {
    for (let i = 0; i < sortCriteria.length; i += 1) {
      const criteria = sortCriteria[i];

      switch (criteria) {
        case 'brand':
          return this.distributeBrands(products);
        case 'price':
          return this.distributePrice(products);
          break;
        case 'color':
          return this.distributeColors(products);
          break;
        default:
          break;
      }
    }
    return [];
  };

  /**
   * get the current date and add by default 57 days
   * @param days
   * @returns object
   */
  addDaysToDate(days = 57) {
    const today = new Date();
    const newDate = addDays(today, days);
    return {
      now: today,
      new: newDate,
    };
  }

  distributeBrands(data) {
    const products = this.orderProductByStock(data);
    return this.interleaveProductsByVendor(products);
  }
  distributeColors(data) {
    const products = this.orderProductByStock(data);
    return this.interleaveProductsByColor(products);
  }

  distributePrice(data) {
    const products = this.orderProductByStock(data);
    return this.interleaveProductsByPrice(products);
  }

  orderProductByStock(products) {
    return products.sort((a, b) => b.totalInventory - a.totalInventory);
  }

  /**
   * group the information by brand and then disperse it so that it is not sorted by brand.
   * @param products 
   * @returns object 
   */
  interleaveProductsByVendor(products) {
    const vendorGroups = {};

    // Group products by vendor
    products.forEach((product) => {
      const vendor = product.vendor;
      if (!vendorGroups[vendor]) {
        vendorGroups[vendor] = [];
      }
      vendorGroups[vendor].push(product);
    });

    const interleavedProducts = [];

    // Create a new arrangement by interspersing one product from each vendor
    let done = false;
    while (!done) {
      done = true;
      for (const vendor in vendorGroups) {
        const vendorProducts = vendorGroups[vendor];
        if (vendorProducts.length > 0) {
          done = false;
          interleavedProducts.push(vendorProducts.shift());
        }
      }
    }
    return interleavedProducts;
  }

  /**
   * group the information by color and then disperse it so that it is not sorted by color.
   * @param products 
   * @returns 
   */
  interleaveProductsByColor(products) {
    const colorGroups = {};

    // Group products by color
    products.forEach((product) => {
      const color = this.getColor(product.title);
      if (!colorGroups[color]) {
        colorGroups[color] = [];
      }
      colorGroups[color].push(product);
    });

    const interleavedProducts = [];

    // Create a new arrangement by interspersing one product from each color
    let done = false;
    while (!done) {
      done = true;
      for (const color in colorGroups) {
        const colorProducts = colorGroups[color];
        if (colorProducts.length > 0) {
          done = false;
          interleavedProducts.push(colorProducts.shift());
        }
      }
    }
    return interleavedProducts;
  }

  /**
   * group the information by price and then disperse it so that it is not sorted by price.
   * @param products 
   * @returns 
   */
  interleaveProductsByPrice(products) {
    const priceGroups = {};

    // Group products by price
    products.forEach((product) => {
      const price = parseFloat(product.priceRangeV2.minVariantPrice.amount);
      if (!priceGroups[price]) {
        priceGroups[price] = [];
      }
      priceGroups[price].push(product);
    });

    const interleavedProducts = [];

    // Create a new arrangement by interspersing one product from each price
    let done = false;
    while (!done) {
      done = true;
      for (const price in priceGroups) {
        const priceProducts = priceGroups[price];
        if (priceProducts.length > 0) {
          done = false;
          interleavedProducts.push(priceProducts.shift());
        }
      }
    }
    return interleavedProducts;
  }
}
