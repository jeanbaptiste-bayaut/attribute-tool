import CoreDataMapper from './core.datamapper.js';

export default class ValueDataMapper extends CoreDataMapper {
  static tableName = 'value';

  static async findByNameAndAttributeid(attributeId, name) {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE attribute_id = ? AND name = ?`,
      [attributeId, name]
    );
    return result[0];
  }

  static async findDivisions() {
    const [result] = await this.client.query(
      `SELECT value.name as brand_name FROM value 
      JOIN attribute on attribute.id = value.attribute_id
      WHERE attribute.name='division';`
    );

    return result;
  }

  static async findSeasons() {
    const [result] = await this.client.query(
      `SELECT DISTINCT product.season as season_name FROM product;`
    );
    return result;
  }

  static async findValuesByAttribute(attributeName) {
    const [result] = await this.client.query(
      `SELECT * FROM value
      WHERE attribute_id = (SELECT id FROM attribute WHERE name = ?);`,
      [attributeName]
    );
    return result;
  }

  static async findParentTypesPerBrand(brand, season) {
    const [result] = await this.client.query(
      `SELECT value.name from value
        WHERE id IN 
        (
            (
              SELECT value_id FROM product_has_attribute as p
              WHERE p.attribute_id = (SELECT id FROM attribute WHERE name = 'parent_type')
              AND p.product_id IN 
              (
                (SELECT product_id FROM product_has_attribute
                  LEFT JOIN product on product.id = product_has_attribute.product_id 
                  WHERE product_has_attribute.value_id = (SELECT id from value where name = ?)
                  AND product.status = 0
                  AND product.season = ?
                )
              )
            )
        )
      ORDER BY value.name ASC;`,
      [brand, season]
    );
    return result;
  }
}
