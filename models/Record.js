const recordModel=require('./sequelize').record

class Record{
    /**
     * 用户
     * @param user
     * @returns {Promise.<*>}
     */
    static async createRecord(record){
        const result=await recordModel.create({
            w_identification:record.w_identification,
            open_time:Date.now(),
            ip:record.ip,
            url:record.url,
            referrer:record.referrer,
            os:record.os,
            browser:record.browser,
        })
        return result
    }
    static async addCloseTime(id){
        const result=await recordModel.update({
            close_time:Date.now()
        },{
            where:{
                id:id
            }
        })
        return result
    }
}

// console.log(new User().getUsers()[0]);
module.exports=Record

