import CoreDataMapper from './core.datamapper.js';

export default class ProductHasAttributeDataMapper extends CoreDataMapper {
  static tableName = 'product_has_attribute';

  static async updateStatus(productId, attributeId, valueId) {
    const result = await this.client.query(
      `
      UPDATE "${this.tableName}"
      SET "status"= FALSE 
      WHERE "product_id" = $1 
      AND "attribute_id" = $2
      AND "value_id" = $3
      RETURNING *;
      `,
      [productId, attributeId, valueId]
    );
    const { rows } = result;
    return rows[0];
  }
}
