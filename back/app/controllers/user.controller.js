import CoreController from './core.controller.js';
import { UserDataMapper } from '../datamappers/index.datamapper.js';

export default class UserController extends CoreController {
  static entityName = 'user';
  static mainDataMapper = UserDataMapper;

  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const result = await UserDataMapper.getUserById(id);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const result = await UserDataMapper.getAllUsers();

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getUserByEmail(req, res) {
    const { email } = req.body;
    try {
      const result = await UserDataMapper.getUserByEmail(email);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    const { email, password } = req.body;

    try {
      const result = await UserDataMapper.createUser(email, password);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await UserDataMapper.login(email, password);

      console.log(result);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getIndexByUser(req, res) {
    const { id } = req.params;
    try {
      const result = await UserDataMapper.getIndexByUser(id);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateIndexByUser(req, res) {
    const { index, id } = req.body;
    try {
      const result = await UserDataMapper.updateIndexByUser(index, id);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateUserLocaleFavorite(req, res) {
    const { id, locale } = req.body;
    try {
      const result = await UserDataMapper.updateUserLocaleFavorite(locale, id);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
