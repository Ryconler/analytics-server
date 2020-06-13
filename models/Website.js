const sequelize = require('./sequelize').sequelize
const Sequelize=require('sequelize')

const websiteModel = sequelize.define('website',{
  id:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
  },
  u_id:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
  },
  config: {
      type: Sequelize.STRING(255),
      allowNull: false,
  },
  host: {
      type: Sequelize.STRING(255),
      allowNull: false,
  },
  index_url: {
      type: Sequelize.STRING(255),
  },
  title: {
      type: Sequelize.STRING(255),
  },
  create_date: {
      type: Sequelize.STRING(20),
      allowNull: false,
  },
  validate: {
      type: Sequelize.STRING(1),
      allowNull: false,
  },
}, {tableName: 'website',timestamps: false});

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

