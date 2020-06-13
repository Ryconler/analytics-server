const Sequelize=require('sequelize')
const config=require('../config/database')

let sequelize =new Sequelize(config.database,config.username,config.password,{
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    operatorsAliases: false,
    logging: false
});

module.exports.Op = Sequelize.Op
module.exports.sequelize = sequelize



