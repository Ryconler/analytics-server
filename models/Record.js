const recordModel = require('./sequelize').record
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

const todayDate = require('../utils/GetTodayDate')

class Record {
  static async createRecord(record) {
    return await recordModel.create(record)
  }

  static async addCloseTimeByUniqueId(w_unique_id) {
    return await recordModel.update({
      close_time: Date.now()
    }, {
      where: {
        w_unique_id
      }
    })
  }

  static async getPVToday(w_unique_id) {
    return await recordModel.count({
      where: {
        w_unique_id,
        open_time: {
          [Op.between]: todayDate
        }
      }
    })
  }

  static async getUVToday(w_unique_id) {
    const ipCounts = await recordModel.findAll({
      attributes:[[sequelize.fn('COUNT', sequelize.col('ip')),'ipCount']],  // select count(ip) as ipCount
      where: {
        w_unique_id,
        open_time: {
          [Op.between]: todayDate
        }
      },
      group: 'ip',  // group by ip
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
    return ipCounts.length  // ip分组数
  }
}

(async function () {
    console.log(await Record.getUVToday('xg08f9znie'));
})()
module.exports = Record

