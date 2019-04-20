const customModel = require('./sequelize').custom
const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize

class Custom {

    static async createCustom(custom) {
        return await customModel.create(custom)
    }

    static async deleteCustomByConfig(config) {
        return await customModel.destroy({
            where:{
                config
            }
        })
    }

    static async getCustomById(id) {
        return await customModel.findOne({
            where: {
                id
            }
        })
    }

    static async updateCustom(config, open_time, newURL, newOpenTime) {
        return await customModel.update({
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
        return await customModel.update({
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

    static async getEventsByDate(config, preTime, sufTime) {
        return await customModel.findAll({
            where: {
                config,
                time: {
                    [Op.between]: [preTime, sufTime]
                },
                track: 'event',
                category: {
                    [Op.ne]: null
                },
                action: {
                    [Op.ne]: null
                }
            },
            raw: true
        })  // => [ { count: 1 }, { count: 25 } ]
    }

    static async getLimitCustoms(config, offset, limit) {
        return await customModel.findAll({
            where: {
                config
            },
            order: [['open_time', 'DESC']],
            offset,
            limit,
            raw: true
        })  // => [ { count: 1 }, { count: 25 } ]
    }

    static async getCustomsCount(config) {
        return await customModel.count({
            where: {
                config
            }
        })
    }

    static async getCustomsByIp(config, ip) {
        return await customModel.findAll({
            where: {
                config,
                ip
            },
            raw: true
        })
    }

    static async getReIps(config) {
        return await customModel.findAll({
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
//     console.log(await Custom.getEventsByDate('WA-PEEIE2MMEV-1',1555573707549,1555742805750));
// })()
module.exports = Custom

