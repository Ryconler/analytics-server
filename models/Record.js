const sequelize = require('./sequelize').sequelize;
const Sequelize=require('sequelize')
const Op = require('./sequelize').Op


const recordModel = sequelize.define('record',{
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    config: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    open_time: {
        type: Sequelize.DATE(),
    },
    close_time: {
        type: Sequelize.DATE(),
    },
    url : {
        type: Sequelize.STRING(255),
    },
    ip: {
        type: Sequelize.STRING(255),
    },
    address: {
        type: Sequelize.STRING(255),
    },
    service: {
        type: Sequelize.STRING(255),
    },
    referrer: {
        type: Sequelize.STRING(255),
    },
    wxh: {
        type: Sequelize.STRING(255),
    },
    depth: {
        type: Sequelize.STRING(255),
    },
    device: {
        type: Sequelize.STRING(255),
    },
    os: {
        type: Sequelize.STRING(255),
    },
    browser_name: {
        type: Sequelize.STRING(255),
    },
    browser_version: {
        type: Sequelize.STRING(255),
    },
}, {tableName: 'record',timestamps: false});


class Record {

    static async createRecord(record) {
        return await recordModel.create(record)
    }

    static async deleteRecordsByConfig(config) {
        return await recordModel.destroy({
            where:{
                config
            }
        })
    }

    static async getRecordById(id) {
        return await recordModel.findOne({
            where: {
                id
            }
        })
    }


    static async addCloseTime(config, open_time, close_time) {
        return await recordModel.update({
            close_time: close_time,
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

    static async getRecordsCount(config) {
        return await recordModel.count({
            where: {
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

    static async getReIps(config) {
        return await recordModel.findAll({
            attributes: ['ip', [sequelize.fn('COUNT', sequelize.col('ip')), 'count']],
            where: {
                config
            },
            group: 'ip',
            having: {
                count: {
                    [Op.gt]: 1
                }
            },
            raw: true
        })
    }
}

// (async () => {
//     console.log(await Record.deleteRecordsByConfig('xxxxx'));
// })()
module.exports = Record

