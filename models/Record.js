const recordModel=require('./sequelize').record

class Record{

    static async createRecord(record){
        return await recordModel.create(record)
    }
    static async addCloseTimeByUniqueId(w_unique_id){
        return await recordModel.update({
            close_time:Date.now()
        },{
            where:{
                w_unique_id
            }
        })

    }
}

// console.log(new User().getUsers()[0]);
module.exports=Record

