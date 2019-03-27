const websitedModel = require('../models/Website')
const recordModel = require('../models/Record')
const dateUtil = require('./DateUtil')


module.exports.getOverview = async function (uid) {
    const websites = await websitedModel.getWebsitesByUId(uid)
    for(let website of websites){
        website.pvToday = await recordModel.getPV(website.track_id, dateUtil.getDayPre(0), dateUtil.getDaySuf(0))
        website.uvToday = await recordModel.getUV(website.track_id, dateUtil.getDayPre(0), dateUtil.getDaySuf(0))
    }
    return websites
}

/* 查询某一天的统计数据
 * date：该天到今天的天数
 */
module.exports.getStatisticsByDate = async function (siteId,date) {
    const website = await websitedModel.getWebsite(siteId)
    if(website){
        return {
            pv: await recordModel.getPV(website.track_id,dateUtil.getDatePre(date),dateUtil.getDateSuf(date)),
            uv: await recordModel.getUV(website.track_id,dateUtil.getDatePre(date),dateUtil.getDateSuf(date))
        }
    }
}
