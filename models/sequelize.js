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




