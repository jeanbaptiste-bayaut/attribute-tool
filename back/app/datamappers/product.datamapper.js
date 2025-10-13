import CoreDataMapper from './core.datamapper.js';

export default class ProductDataMapper extends CoreDataMapper {
  static tableName = 'product';

  static async findAllProducts(brand, season) {
    const [result] = await this.client.query(
      `
       SELECT 
        product.id as product_id,
        product.name as product_name, 
        product.style as product_style,
        product.color as product_color, 
        product.image_url as image_url,
        english.status as master
      FROM product_has_attribute
        JOIN product on product.id = product_has_attribute.product_id
        LEFT JOIN english on product.id = english.product_id
      WHERE product.status = 'false'
        AND product.season = ?
        AND product_has_attribute.value_id = (SELECT id FROM value WHERE name = ?);`,
      [season, brand]
    );

    const [parentTypes] = await this.client.query(
      `
      SELECT product_has_attribute.product_id as productId, value.name as parentType from product_has_attribute
        JOIN attribute on attribute.id = product_has_attribute.attribute_id
        JOIN value on value.id = product_has_attribute.value_id
      WHERE attribute.name = 'parent_type';
      `
    );

    result.map((product) => {
      product['parent_type'] = parentTypes.find(
        (parentType) => product.product_id == parentType.productId
      ).parentType;
    });

    return result;
  }

  static async findProductWithAttributeByPk(id) {
    const [result] = await this.client.query(
      `SELECT product.id as product_id, product.style as product_style, product.name as product_name,
      attribute.name as attribute_name, value.name as value_name, product.image_url as image_url, product_has_attribute.status as status
      FROM product
      JOIN product_has_attribute ON product.id = product_has_attribute.product_id
      JOIN attribute ON product_has_attribute.attribute_id = attribute.id
      JOIN value ON product_has_attribute.value_id = value.id
      WHERE product.id = ?`,
      [id]
    );

    return result;
  }

  static async switchProductStatus(id) {
    await this.client.query(
      `UPDATE product SET status = TRUE
      WHERE id = ?;`,
      [id]
    );

    const [result] = await this.client.query(
      `SELECT product.style as product_style FROM product WHERE id = ?;`,
      [id]
    );

    return result[0];
  }

  static async switchAttributeValueStatus(id, attributeId, valueId) {
    await this.client.query(
      `UPDATE product_with_attribute SET status = FALSE
      WHERE id = ? 
      AND attribute_id= ?
      AND value_id= ?;`,
      [id, attributeId, valueId]
    );

    const [result] = await this.client.query(
      `SELECT product_with_attribute.product_id as product_id FROM product_with_attribute WHERE id = ?;`,
      [id]
    );
    return result[0];
  }
}
