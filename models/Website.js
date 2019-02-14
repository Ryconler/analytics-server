const websiteModel=require('./sequelize').website

class Website{
    /**
     * 网站
     * @param website
     * @returns {Promise.<*>}
     */
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
}

// console.log(new User().getUsers()[0]);
module.exports=Website

