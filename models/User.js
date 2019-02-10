const userModel=require('./sequelize').user

class User{
    /**
     * 用户
     * @param user
     * @returns {Promise.<*>}
     */
    static async createUser(user){
        const result=await userModel.create({
            username:user.username,
            password:user.password,
            email:user.email,
            register_date:new Date().toLocaleString()
        })
        return result
    }
    static async getUserById(id){
        const result=await userModel.findOne({
            where:{
                id:id
            }
        })
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
    static async getUsers(){
        const result=await userModel.findAll()
        return result
    }
}

// console.log(new User().getUsers()[0]);
module.exports=User

