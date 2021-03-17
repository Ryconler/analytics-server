const Op = require('./sequelize').Op
const sequelize = require('./sequelize').sequelize
const Sequelize=require('sequelize')

const customModel = sequelize.define('custom',{
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    config: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    track: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING(255),
    },
    action: {
        type: Sequelize.STRING(255),
    },
    label: {
        type: Sequelize.STRING(255),
    },
    value: {
        type: Sequelize.STRING(255),
    },
    url: {
        type: Sequelize.STRING(255),
    },
    ip: {
        type: Sequelize.STRING(255),
    },
    create_time: {
        type: Sequelize.DATE(),
        allowNull: false,
    }
}, {tableName: 'custom',timestamps: false});

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


    static async getEventsByDate(config, preTime, sufTime) {
        return await customModel.findAll({
            where: {
                config,
                create_time: {
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

    static async getConversionsByDate(config, preTime, sufTime) {
        return await customModel.findAll({
            where: {
                config,
                create_time: {
                    [Op.between]: [preTime, sufTime]
                },
                track: 'conversion',
                category: {
                    [Op.ne]: null
                },
                action: {
                    [Op.ne]: null
                },
                label: {
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
//     console.log(await Custom.getConversionsByDate('WA-7061Q7-1',1555573707549,1558332100888));
// })()
module.exports = Custom

