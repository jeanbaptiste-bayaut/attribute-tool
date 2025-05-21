import CoreDataMapper from './core.datamapper.js';

export default class ProductDataMapper extends CoreDataMapper {
  static tableName = 'product';

  static async findAllProducts(brand, season) {
    const [result] = await this.client.query(
      `
      SELECT product.id as product_id, 
      product.style as product_style,
      product.color as product_color, 
      product.image_url as image_url
      FROM product
      JOIN english ON english.product_id = product.id
      JOIN french ON french.product_id = product.id
      JOIN spanish ON spanish.product_id = product.id
      JOIN german ON german.product_id = product.id
      JOIN italian ON italian.product_id = product.id
      JOIN portuguese ON portuguese.product_id = product.id
      JOIN dutch ON dutch.product_id = product.id
      JOIN product_has_attribute ON product_has_attribute.product_id = product.id
      JOIN value ON product_has_attribute.value_id = value.id
      WHERE product.status = 'false'
      AND product.season=?
      AND value.name=?;`,
      [season, brand]
    );

    return result;
  }

  static async findProductWithAttributeByPk(id) {
    const [result] = await this.client.query(
      `SELECT product.id as product_id, product.style as product_style, product.name as product_name,
      attribute.name as attribute_name, value.name as value_name, product.image_url as image_url 
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
