const websiteModel = require('./sequelize').website


class Website {

  static async addWebsite(website) {
    return await websiteModel.create(website)
  }
  static async updateWebsite(website) {
    return await websiteModel.update({
      host: website.host,
      index_url: website.index_url,
      title: website.title,
    },{
      where:{
        id:website.id
      }
    })
  }
  static async deleteWebsiteByConfig(config) {
    return await websiteModel.destroy({
      where:{
        config
      }
    })
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

  static async getWebsiteByConfig(config) {
    return await websiteModel.findOne({
      where: {
        config
      },
      raw: true
    })
  }
}
//
// (async function () {
//   console.log(await Website.updateWebsite({id:3,host:'xxx',index_url: 'aaa'}));
// })()
module.exports = Website

