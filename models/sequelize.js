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
    config: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    open_time: {
        type: Sequelize.INTEGER(20),
    },
    close_time: {
        type: Sequelize.INTEGER(20),
    },
    urls : {
        type: Sequelize.STRING(2550),
    },
    open_times : {
        type: Sequelize.STRING(2550),
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
    wxh: {
        type: Sequelize.STRING(10),
    },
    depth: {
        type: Sequelize.STRING(10),
    },
    device: {
        type: Sequelize.STRING(10),
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

module.exports.website=sequelize.define('website',{
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    u_id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    config: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    host: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    index_url: {
        type: Sequelize.STRING(255),
    },
    title: {
        type: Sequelize.STRING(255),
    },
    create_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    validate: {
        type: Sequelize.STRING(1),
        allowNull: false,
    },
}, {tableName: 'website',timestamps: false});

module.exports.Op = Sequelize.Op
module.exports.sequelize = sequelize



