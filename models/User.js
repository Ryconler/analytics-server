const userModel=require('./sequelize').user

class User{
    /**
     * 用户
     * @param user
     * @returns {Promise.<*>}
     */
    static async createUser(user){
        const result=await userModel.create(user)
        return result
    }

    static async getUserByUsername(username){
        const result=await userModel.findOne({
            where:{
                username:username
            }
        })
        return result
    }
}

// console.log(new User().getUsers()[0]);
module.exports=User

