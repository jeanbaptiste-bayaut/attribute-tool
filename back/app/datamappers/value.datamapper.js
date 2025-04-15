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
}
