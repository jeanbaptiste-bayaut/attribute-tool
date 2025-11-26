import CoreDataMapper from './core.datamapper.js';

export default class ProductHasAttributeDataMapper extends CoreDataMapper {
  static tableName = 'product_has_attribute';

  static async updateStatus(data) {
    try {
      data.forEach(async (product) => {
        if (product.status == 0) {
          await this.client.query(
            `
      UPDATE ${this.tableName}
      SET status = FALSE
      WHERE product_id = (SELECT id from product WHERE style = ?)
      AND attribute_id = (SELECT id from attribute WHERE attribute.name = ?)
      AND value_id = 
        (SELECT id from value 
        WHERE value.name = ? 
        AND value.attribute_id = (SELECT id from attribute WHERE attribute.name = ?)
        );
      `,
            [
              product.product_style,
              product.attribute_name,
              product.value_name,
              product.attribute_name,
            ]
          );
        }

        if (product.addAttribute !== 0) {
          await this.client.query(
            `
        UPDATE ${this.tableName}
        SET additionalValue = ?
        WHERE product_id = (SELECT id from product WHERE style = ?)
        AND attribute_id = (SELECT id from attribute WHERE attribute.name = ?)
        AND value_id = 
          (SELECT id from value 
          WHERE value.name = ? 
          AND value.attribute_id = (SELECT id from attribute WHERE attribute.name = ?)
          );
        `,
            [
              product.addAttribute,
              product.product_style,
              product.attribute_name,
              product.value_name,
              product.attribute_name,
            ]
          );
        }
      });

      return {
        message: 'Status updated successfully',
      };
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
}
