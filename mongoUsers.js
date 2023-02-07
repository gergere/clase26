import mongoose from "mongoose";
import * as bcrypt from "./bcrypt.js";
import config from "./config.js";

export default class MongoUsers {
  constructor() {
    const userSchema = new mongoose.Schema({
      username: { type: String, require: true, unique: true },
      password: { type: String, require: true }
    })
    this.model = mongoose.model('usuarios', userSchema);
  }

  async connect() {
    await mongoose.connect(config.cnxStr);
  }

  async createUser(username, password) {
    const existe = await this.findUser(username);
    if (existe.length !== 0) {
      return false;
    } else {
      const cryptPass = await bcrypt.cryptPassword(password)
      await this.model.create({ username, password: cryptPass });
      return true
    }
  }

  async findUser(username) {
    await this.connect();
    return await this.model.find({ username })
  }

}