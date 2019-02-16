const websiteModel=require('./sequelize').website

class Website{

    static async addWebsite(website){
        return await websiteModel.create(website)
    }
    static async getWebsitesByUId(u_id){
        return await websiteModel.findAll({
            where:{
                u_id
            }
        })

    }

    static async getWebsite(id){
        return await websiteModel.findOne({
            where:{
                id
            }
        })

    }
}

// console.log(new User().getUsers()[0]);
module.exports=Website

