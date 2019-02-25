const userModel = require('./sequelize').user

class User {

  static async createUser(user) {
    return await userModel.create(user)
  }

  static async getUserByUsername(username) {
    return await userModel.findOne({
      where: {
        username: username
      },
      raw: true
    })
  }
}

// console.log(new User().getUsers()[0]);
module.exports = User

