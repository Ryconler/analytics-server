const recordModel = require('./sequelize').record
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

class Record {

  static async createRecord(record) {
    return await recordModel.create(record)
  }
  static async updateRecord(config,open_time,close_time,urls,open_times){
    return await recordModel.update({
      close_time: close_time,
      urls: urls,
      open_times: open_times
    },{
      where:{
        config,
        open_time
      }
    })
  }


  static async getPV(config,preDate,sufDate) {
    return await recordModel.count({
      where: {
        config,
        open_time: {
          [Op.between]: [preDate,sufDate]
        }
      }
    })
  }
  static async getUV(config,preDate,sufDate) {
    const ipCounts = await recordModel.findAll({
      attributes:[[sequelize.fn('COUNT', sequelize.col('ip')),'ipCount']],  // select count(ip) as ipCount
      where: {
        config,
        open_time: {
          [Op.between]: [preDate,sufDate]
        }
      },
      group: 'ip',  // group by ip
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
    return ipCounts.length  // ip分组数
  }

  static async getRecordsByDate(config,preTime,sufTime) {
    return await recordModel.findAll({
      where: {
        config,
        open_time: {
          [Op.between]: [preTime,sufTime]
        }
      },
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
  }
  static async getLimitRecords(config,offset,limit) {
    return await recordModel.findAll({
      where: {
        config
      },
      order: [['open_time', 'DESC']],
      offset,
      limit,
      raw: true
    })  // => [ { count: 1 }, { count: 25 } ]
  }
}
// (async ()=>{
//   console.log(await Record.getPV('1553948120222', '1553948120222'));
// })()
module.exports = Record

