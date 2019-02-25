const websiteModel = require('./sequelize').website


class Website {

  static async addWebsite(website) {
    return await websiteModel.create(website)
  }

  static async getWebsitesByUId(u_id) {
    return await websiteModel.findAll({
      where: {
        u_id
      },
      raw: true
    })

  }

  static async getWebsite(id) {
    return await websiteModel.findOne({
      where: {
        id
      },
      raw: true
    })
  }

}


module.exports = Website

