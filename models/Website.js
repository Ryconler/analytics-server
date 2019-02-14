const websiteModel=require('./sequelize').website

class Website{
    /**
     * 网站
     * @param website
     * @returns {Promise.<*>}
     */
    static async addWebsite(website){
        const result=await websiteModel.create(website)
        return result
    }
    static async getWebsitesByUId(u_id){
        const result=await websiteModel.findAll({
            where:{
                u_id
            }
        })
        return result
    }
}

// console.log(new User().getUsers()[0]);
module.exports=Website

