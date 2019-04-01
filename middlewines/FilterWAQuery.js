const recordModel = require('../models/Record')
const websiteModel = require('../models/Website')
const clientUtil = require('../utils/ClientUtil')

module.exports = async (ctx, next) => {
    if (ctx.path === '/resources/images/wa.gif') {
        const query = ctx.query
        const cookies = ctx.cookies
        // console.log(query.closeTime);
        if (!query.closeTime) {  // 打开页面
            let wa_urls = cookies.get('wa_urls')
            let wa_opens = cookies.get('wa_opens')
            if (wa_urls) {  // 不是第一次请求,添加cookie跟踪页面跳转记录
                ctx.cookies.set('wa_urls', wa_urls + ',' + query.url)
                ctx.cookies.set('wa_opens', wa_opens + ',' + Date.now())
            } else {  // 第一次请求，创建一个记录
                ctx.cookies.set('wa_urls', query.url)
                ctx.cookies.set('wa_opens', query.openTime)
                const {device, os} = clientUtil.getDeviceAndOS(query.userAgent)
                const {browserName, browserVersion} = clientUtil.getBrowserInfo(query.userAgent, query.appName, query.appVersion)
                const record = {
                    config: query.config || 'unknown',
                    open_time: query.openTime,
                    ip: ctx.ip,
                    wxh: query.width + 'x' + query.height,
                    depth: query.colorDepth,
                    device: device,
                    os: os,
                    browser_name: browserName,
                    browser_version: browserVersion
                }
                await recordModel.createRecord(record)
            }
        } else {  // 关闭页面，获取cookie记录信息，更新记录
            // console.log('wa_urls', ctx.cookies.get('wa_urls'));
            // console.log('wa_opens', ctx.cookies.get('wa_opens'));
            // console.log(query);
            await recordModel.updateRecord(query.config, query.openTime, query.closeTime, ctx.cookies.get('wa_urls'), ctx.cookies.get('wa_opens'))
        }
    }
    await next()

}
