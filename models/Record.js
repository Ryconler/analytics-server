const recordModel = require('./sequelize').record
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

class Record {

  static async createRecord(record) {
    return await recordModel.create(record)
  }

  static async addCloseTimeByTrackId(track_id) {
    return await recordModel.update({
      close_time: Date.now()
    }, {
      where: {
        track_id
      }
    })
  }

  static async getPV(track_id,preDate,sufDate) {
    return await recordModel.count({
      where: {
        track_id,
        open_time: {
          [Op.between]: [preDate,sufDate]
        }
      }
    })
  }
  static async getUV(track_id,preDate,sufDate) {
    const ipCounts = await recordModel.findAll({
      attributes:[[sequelize.fn('COUNT', sequelize.col('ip')),'ipCount']],  // select count(ip) as ipCount
      where: {
        track_id,
        open_time: {
          [Op.between]: [preDate,sufDate]
        }
      },
      group: 'ip',  // group by ip
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
    return ipCounts.length  // ip分组数
  }

}

module.exports = Record

