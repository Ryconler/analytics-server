const sequelize = require('./sequelize').sequelize;
const Sequelize=require('sequelize')

const userModel = sequelize.define('user',{
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

class User {

    static async createUser(user) {
        return await userModel.create(user)
    }

    static async getUserByUsername(username) {
        return await userModel.findOne({
            where: {
                username: username
            },
            raw: true
        })
    }

    static async updateUserPassword(user) {
        return await userModel.update({
            password: user.newPswHash
        }, {
            where: {
                id: user.id
            }
        })
    }
}

// console.log(new User().getUsers()[0]);
module.exports = User

