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
    operatorsAliases: false
});

module.exports.user=sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    register_date: {
        type: Sequelize.STRING(20),
        allowNull: false
    }
}, {tableName: 'user',timestamps: false});

module.exports.record=sequelize.define('record',{
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    w_identification: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    open_time: {
        type: Sequelize.INTEGER(20),
    },
    close_time: {
        type: Sequelize.INTEGER(20),
    },
    ip: {
        type: Sequelize.STRING(50),
    },
    url: {
        type: Sequelize.STRING(255),
    },
    referrer: {
        type: Sequelize.STRING(255),
    },
    os: {
        type: Sequelize.STRING(255),
    },
    browser: {
        type: Sequelize.STRING(255),
    },
}, {tableName: 'record',timestamps: false});




