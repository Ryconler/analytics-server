const websitedModel = require('../models/Website')
const recordModel = require('../models/Record')
const customModel = require('../models/Custom')
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
        website.name = website.host + ' - ' + website.title
    }
    // console.log(websites);
    return websites
}

/* 查询某一天的统计数据
 * date：该天到今天的天数
 */
module.exports.getStatisticsByDate = async function (config, date) {
    const records = await recordModel.getRecordsByDate(config, dateUtil.getTimePre(date), dateUtil.getTimeSuf(date))
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

/* 查询某时间段内某个属性的比较数据
 * days：近多少天
 */
module.exports.getCompare = async function (config, days) {
    let pvData = []
    let uvData = []
    let brData = []
    let adData = []
    let result = {}
    for (let i = 0; i < days; i++) {
        result = await this.getStatisticsByDate(config, days - i - 1)
        pvData.push(result.pv)
        uvData.push(result.uv)
        brData.push(parseFloat(result.br))
        const t1 = result.ad.split('″')[0]
        const t2 = t1.split('′')[0] + '.' + t1.split('′')[1]
        adData.push(parseFloat(t2))
    }
    return {
        pvData,
        uvData,
        brData,
        adData,
    }
}

/* 查询某时间段内新旧访客数据
 * days：近多少天
 */
module.exports.getONVisitor = async function (config, days) {
    let newIpNum = 0
    let oldIpNum = 0
    let oldIps = new Set()
    let daysIps = new Set()
    const records1 = await recordModel.getRecordsByDate(config, 0, dateUtil.getTimeSuf(days))  // 截至到days前一天的records
    records1.forEach(item => {
        oldIps.add(item.ip)
    })
    const records2 = await recordModel.getRecordsByDate(config, dateUtil.getTimePre(days - 1), dateUtil.getTimeSuf(0))
    records2.forEach(item => {
        daysIps.add(item.ip)
    })
    for (let ip of daysIps) {
        if (oldIps.has(ip)) {
            oldIpNum++
        } else {
            newIpNum++
        }
    }
    return [newIpNum, oldIpNum]
}

/* 查询用户存留数据
 */
module.exports.getSVisitor = async function (config, days) {
    let oldIps = new Set()
    // 截至到days前两天的records
    const records1 = await recordModel.getRecordsByDate(config, 0, dateUtil.getTimeSuf(days + 1))
    records1.forEach(item => {
        oldIps.add(item.ip)
    })
    let daysIps = new Set()
    let activeIps = new Set()
    let repeatIps = []
    let lostIpNum = 0
    // days前一天到今天的records
    const records2 = await recordModel.getRecordsByDate(config, dateUtil.getTimePre(days), dateUtil.getTimeSuf(0))
    records2.forEach(item => {
        if (!daysIps.has(item.ip)) {  // 未出现过的ip
            repeatIps.push({ip: item.ip, openDate: dateUtil.toDayString(item.open_time)})
            daysIps.add(item.ip)
        } else { // 之前出现过，比较时间差是不是一天
            repeatIps.forEach(rip => {
                if (rip.ip === item.ip && rip.openDate !== dateUtil.toDayString(item.open_time)) {
                    // console.log(item);
                    activeIps.add(rip.ip)
                }
            })
        }
    })
    const activeIpNum = activeIps.size
    const inActiveIpNum = daysIps.size - activeIpNum
    for (let ip of oldIps) {
        if (!daysIps.has(ip)) {
            lostIpNum++
        }
    }
    return [activeIpNum, inActiveIpNum, lostIpNum]
}

/* 查询某时间段内的自定义事件数据
 * days：该天到今天的天数
 */
module.exports.getEvents = async function (config, days) {
    let allEvents = {}
    let catEvents = {}
    let actEvents = {}
    let labEvents = {}
    const events = await customModel.getEventsByDate(config, dateUtil.getTimePre(days - 1), dateUtil.getTimeSuf(0))
    events.forEach(event => {
        let p = `${event.category} + ${event.action} + ${event.label}`
        allEvents[p] = allEvents[p] || {count:0 , ips: new Set()}
        allEvents[p].count ++
        allEvents[p].ips.add(event.ip)


        catEvents[event.category] = catEvents[event.category] || {count:0 , ips: new Set()}
        catEvents[event.category].count ++
        catEvents[event.category].ips.add(event.ip)

        actEvents[event.action] = actEvents[event.action] || {count:0 , ips: new Set()}
        actEvents[event.action].count ++
        actEvents[event.action].ips.add(event.ip)
        if(event.label){
            labEvents[event.label] = labEvents[event.label] || {count:0 , ips: new Set()}
            labEvents[event.label].count ++
            labEvents[event.label].ips.add(event.ip)
        }
    })
    let allEventData = []
    let catEventData = []
    let actEventData = []
    let labEventData = []
    for (let name in allEvents) {
        allEventData.push({
            name: name,
            count: allEvents[name].count,
            ipCount: allEvents[name].ips.size
        })
    }
    for (let name in catEvents) {
        catEventData.push({
            name: name,
            count: catEvents[name].count,
            ipCount: catEvents[name].ips.size
        })
    }
    for (let name in actEvents) {
        actEventData.push({
            name: name,
            count: actEvents[name].count,
            ipCount: actEvents[name].ips.size
        })
    }
    for (let name in labEvents) {
        labEventData.push({
            name: name,
            count: labEvents[name].count,
            ipCount: labEvents[name].ips.size
        })
    }
    return {
        allEventData,
        catEventData,
        actEventData,
        labEventData
    }
}

/* 查询某时间段内的转化数据
 * days：该天到今天的天数
 */
module.exports.getConversions = async function (config, days) {
    let conversions = {}
    const results = await customModel.getConversionsByDate(config, dateUtil.getTimePre(days - 1), dateUtil.getTimeSuf(0))
    results.forEach(result => {
        let queue = parseInt(result.label)
        if(queue){
            conversions[result.category] = conversions[result.category] || [[],[]]
            conversions[result.category][0][queue-1] = result.action
            conversions[result.category][1][queue-1] = conversions[result.category][1][queue-1]?conversions[result.category][1][queue-1]+1:1
        }
    })
    return conversions
}

