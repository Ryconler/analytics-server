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
    static async getPVToday(w_unique_id){
        return await recordModel.count({
            where:{
                w_unique_id
            }
        })
    }
}

// (async function () {
//     console.log(await Record.getPV('ripwugj5da'));
// })()
module.exports=Record

