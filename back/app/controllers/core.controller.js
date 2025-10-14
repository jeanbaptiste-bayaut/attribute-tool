export default class CoreController {
  static entityName = null;
  static mainDataMapper = null;

  static async getAll(req, res) {
    try {
      const result = await this.mainDataMapper.findAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getByName(req, res) {
    const { name } = req.params;
    try {
      const result = await this.mainDataMapper.findByName(name);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
