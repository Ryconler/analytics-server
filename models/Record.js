const recordModel = require('./sequelize').record
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

class Record {

    static async createRecord(record) {
        return await recordModel.create(record)
    }

    static async getRecordById(id){
        return await recordModel.findOne({
            where:{
                id
            }
        })
    }
    static async updateRecord(config, open_time, newURL, newOpenTime) {
        return await recordModel.update({
            urls: sequelize.fn('CONCAT', sequelize.col('urls'), ',', newURL),
            open_times: sequelize.fn('CONCAT', sequelize.col('open_times'), ',', newOpenTime),
        }, {
            where: {
                config,
                open_time
            }
        })
    }

    static async addCloseTime(config, open_time, close_time) {
        return await recordModel.update({
            close_time: close_time,
        }, {
            where: {
                config,
                open_time,
                close_time: {
                    [Op.lt]: close_time
                }
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

    static async getRecordsCount(config){
        return await recordModel.count({
            where:{
                config
            }
        })
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
//   console.log(await Record.getRecordsCount('WA-PEEIE2MMEV-1'));
// })()
module.exports = Record

