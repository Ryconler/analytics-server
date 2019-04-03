const recordModel = require('./sequelize').record
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

class Record {

    static async createRecord(record) {
        return await recordModel.create(record)
    }

    static async updateRecord(config, open_time, close_time, urls, open_times) {
        return await recordModel.update({
            close_time: close_time,
            urls: urls,
            open_times: open_times
        }, {
            where: {
                config,
                open_time
            }
        })
    }


    static async getRecordsByDate(config, preTime, sufTime) {
        return await recordModel.findAll({
            where: {
                config,
                open_time: {
                    [Op.between]: [preTime, sufTime]
                }
            },
            raw: true
        })  // => [ { count: 1 }, { count: 25 } ]
    }

    static async getLimitRecords(config, offset, limit) {
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

    static async getRecordsByIp(config, ip) {
        return await recordModel.findAll({
            where: {
                config,
                ip
            },
            raw: true
        })
    }
}

// (async ()=>{
//   console.log(await Record.findOneRecordByIp('q3bie416jl', '117.136.46.15'));
// })()
module.exports = Record

