const recordModel = require('../models/Record')
const client =require('../middlewines/GetClientInfo')

module.exports = async (ctx, next) => {
    await next()
    if (ctx.path === '/resources/images/wa.gif') {
        const query = ctx.query
        const {device,os} = client.getDeviceAndOS(query.userAgent)
        const {browserName,browserVersion} = client.getBrowserInfo(query.userAgent,query.appName,query.appVersion)
        const record = {
            w_unique_id: query.account,
            open_time: query.openTime,
            close_time: query.closeTime,
            ip: ctx.ip,
            url: query.url,
            referrer: query.referrer,
            wxh: query.width+'x'+query.height,
            depth: query.colorDepth,
            device: device,
            os: os,
            browser_name: browserName,
            browser_version: browserVersion
        }
        await recordModel.createRecord(record)
    }
}
