import CoreDataMapper from './core.datamapper.js';

export default class ProductHasAttributeDataMapper extends CoreDataMapper {
  static tableName = 'product_has_attribute';

  static async updateStatus(productId, attributeId, valueId) {
    await this.client.query(
      `
      UPDATE ${this.tableName}
      SET status= FALSE 
      WHERE product_id = ?
      AND attribute_id = ?
      AND value_id = ?;
      `,
      [productId, attributeId, valueId]
    );

    const [result] = await this.client.query(
      `SELECT id FROM ${this.tableName}
      WHERE product_id = ?
      AND attribute_id = ?
      AND value_id = ?;`,
      [productId, attributeId, valueId]
    );

    return result[0];
  }
}
