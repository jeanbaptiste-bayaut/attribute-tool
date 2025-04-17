import CoreDataMapper from './core.datamapper.js';

export default class ProductHasAttributeDataMapper extends CoreDataMapper {
  static tableName = 'product_has_attribute';

  static async updateStatus(data) {
    try {
      data.forEach(async (product) => {
        const [update] = await this.client.query(
          `
      UPDATE ${this.tableName}
      SET status= FALSE
      WHERE product_id = ?
      AND attribute_id = (SELECT id from attribute WHERE attribute.name = ?)
      AND value_id = 
        (SELECT id from value 
        WHERE value.name = ? 
        AND value.attribute_id = (SELECT id from attribute WHERE attribute.name = ?)
        );
      `,
          [
            product.product_id,
            product.attribute_name,
            product.attribute_name,
            product.value_name,
          ]
        );

        console.log('Update result:', update);

        if (update.affectedRows === 0) {
          return { message: 'No rows updated' };
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
