import CoreDataMapper from './core.datamapper.js';

export default class ValueDataMapper extends CoreDataMapper {
  static tableName = 'value';

  static async findByNameAndAttributeid(attributeId, name) {
    const result = await this.client.query(
      `SELECT * FROM "${this.tableName}" WHERE "attribute_id" = $1 AND "name" = $2`,
      [attributeId, name]
    );
    const { rows } = result;
    return rows[0];
  }

  static async findDivisions() {
    const result = await this.client.query(
      `SELECT "value"."name" as "brand_name" FROM "value" 
      JOIN "attribute" on "attribute"."id" = "value"."attribute_id"
      WHERE "attribute"."name"='division';`
    );
    const { rows } = result;
    return rows;
  }

  static async findSeasons() {
    const result = await this.client.query(
      `SELECT DISTINCT "product"."season" as "season_name" FROM "product";`
    );
    const { rows } = result;
    return rows;
  }
}
