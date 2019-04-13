const websitedModel = require('../models/Website')
const recordModel = require('../models/Record')
const dateUtil = require('./DateUtil')

/* 获取用户所有网站的总览 */
module.exports.getOverview = async function (uid) {
    const websites = await websitedModel.getWebsitesByUId(uid)
    for (let website of websites) {
        const records = await recordModel.getRecordsByDate(website.config, dateUtil.getTimePre(0), dateUtil.getTimeSuf(0))
        let pv = records.length  // 访问量
        let singlePage = pv  // 只访问一页的情况
        let duration = 0  // 总访问时长，毫秒
        let online = 0  // 实时在线人数
        let ips = []
        records.forEach((record, index) => {
            if (ips.indexOf(record.ip) === -1) { // 新ip
                ips.push(record.ip)
            }
            const urls = record.urls
            if (urls && urls.split(',').length <= 1) {
                singlePage--
            }
            if (record.close_time) {
                duration = duration + (parseInt(record.close_time) - parseInt(record.open_time))
            } else {
                online++
            }
        })
        website.pv = pv
        website.uv = ips.length
        website.br = (100 * (singlePage / pv) || 100).toFixed(1) + '%'
        const adSeconds = Math.round(duration / pv / 1000) || 0
        let ad = ''
        if (adSeconds > 59) {
            let minutes = Math.floor(adSeconds / 60)
            let seconds = adSeconds % 60
            ad = minutes + `′` + seconds + `″`
        } else {
            ad = adSeconds + `″`
        }
        website.ad = ad
        website.ol = online
    }
    // console.log(websites);
    return websites
}

/* 查询某一天的统计数据
 * date：该天到今天的天数
 */
module.exports.getStatisticsByDate = async function (siteId, date) {
    const website = await websitedModel.getWebsite(siteId)
    if (website) {
        const records = await recordModel.getRecordsByDate(website.config, dateUtil.getTimePre(date), dateUtil.getTimeSuf(date))
        let pv = records.length  // 访问量
        let singlePage = pv  // 只访问一页的情况
        let duration = 0  // 总访问时长，毫秒
        let ips = []
        records.forEach((record, index) => {
            if (ips.indexOf(record.ip) === -1) { // 新ip
                ips.push(record.ip)
            }
            const urls = record.urls
            if (urls && urls.split(',').length <= 1) {
                singlePage--
            }
            if (record.close_time) {
                duration = duration + (parseInt(record.close_time) - parseInt(record.open_time))
            }
        })
        const adSeconds = Math.round(duration / pv / 1000) || 0
        return {
            pv: pv,
            uv: ips.length,
            br: (100 * (singlePage / pv) || 100).toFixed(1) + '%',
            ad: dateUtil.toMinutesString(adSeconds)
        }
    }
}

/* 查询某时间段内某个属性的比较数据
 * days：近多少天
 * comp：比较的属性
 */
module.exports.getCompare = async function (siteId, days) {
    let pvData = []
    let uvData = []
    let brData = []
    let adData = []
    let result = {}
    for (let i = 0;i<days;i++){
        result = await this.getStatisticsByDate(siteId,days-i-1)
        pvData.push(result.pv)
        uvData.push(result.uv)
        brData.push(parseFloat(result.br))
        const t1 = result.ad.split('″')[0]
        const t2 = t1.split('′')[0]+'.'+t1.split('′')[1]
        adData.push(parseFloat(t2))
    }
    return {
        pvData,
        uvData,
        brData,
        adData,
    }
}
