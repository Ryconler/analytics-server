const userModel=require('./sequelize').user

class User{
    /**
     * 用户
     * @param user
     * @returns {Promise.<*>}
     */
    static async createUser(user){
        return await userModel.create(user)

    }

    static async getUserByUsername(username){
        return await userModel.findOne({
            where:{
                username:username
            }
        })
    }
}

// console.log(new User().getUsers()[0]);
module.exports=User

