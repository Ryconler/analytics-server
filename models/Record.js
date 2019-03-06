const recordModel = require('./sequelize').record
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

const todayDate = require('../utils/GetTodayDate')
const yesterdayDate = require('../utils/GetYesterdayDate')

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

  static async getPVToday(track_id) {
    return await recordModel.count({
      where: {
        track_id,
        open_time: {
          [Op.between]: todayDate
        }
      }
    })
  }
  static async getPVYesterday(track_id) {
    return await recordModel.count({
      where: {
        track_id,
        open_time: {
          [Op.between]: yesterdayDate
        }
      }
    })
  }
  static async getUVToday(track_id) {
    const ipCounts = await recordModel.findAll({
      attributes:[[sequelize.fn('COUNT', sequelize.col('ip')),'ipCount']],  // select count(ip) as ipCount
      where: {
        track_id,
        open_time: {
          [Op.between]: todayDate
        }
      },
      group: 'ip',  // group by ip
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
    return ipCounts.length  // ip分组数
  }
  static async getUVYesterday(track_id) {
    const ipCounts = await recordModel.findAll({
      attributes:[[sequelize.fn('COUNT', sequelize.col('ip')),'ipCount']],  // select count(ip) as ipCount
      where: {
        track_id,
        open_time: {
          [Op.between]: yesterdayDate
        }
      },
      group: 'ip',  // group by ip
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
    return ipCounts.length  // ip分组数
  }
  static async getRecordsToday(track_id) {
    return await recordModel.findAll({
      where: {
        track_id,
        open_time: {
          [Op.between]: todayDate
        }
      },
      raw: true
    })
  }
  static async getRecordsYesterday(track_id) {
    return await recordModel.findAll({
      where: {
        track_id,
        open_time: {
          [Op.between]: yesterdayDate
        }
      },
      raw: true
    })
  }
}

// (async function () {
//     console.log(await Record.getUVToday('xg08f9znie'));
// })()
module.exports = Record

