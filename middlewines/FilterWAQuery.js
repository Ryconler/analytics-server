const recordModel = require('../models/Record')
const websiteModel = require('../models/Website')
const clientUtil = require('../utils/ClientUtil')
const api = require('../utils/ApiUtil')

module.exports = async (ctx, next) => {
    await next()
    if (ctx.path === '/resources/images/wa.gif') {
        const query = ctx.query
        const headers = ctx.headers
        if (!query.closeTime) {  // 打开页面
            if (query.first === '1') {  // 第一次打开，创建记录
                const {device, os, browserName} = clientUtil.getClient(headers['user-agent'], query.appName)
                const record = {
                    config: query.config || 'unknown',
                    open_time: query.openTime,
                    open_times: query.openTime,
                    close_time: '',
                    url: query.url,
                    urls: query.url,
                    ip: query.ip,
                    address: query.address,
                    service: query.service,
                    referrer: query.referrer,
                    wxh: query.width + 'x' + query.height,
                    depth: query.colorDepth,
                    device: device,
                    os: os,
                    browser_name: browserName
                }
                await recordModel.createRecord(record)
            } else {  // 不是第一次打开，跟新记录
                await recordModel.updateRecord(query.config, query.openTime, query.url, Date.now().toString())
            }
        } else {  // 关闭页面，添加关闭时间字段
            await recordModel.addCloseTime(query.config, query.openTime, query.closeTime)
        }
    }

    if (ctx.path === '/resources/images/test.gif') {
        // console.log(ctx.headers['user-agent']);
        // const ua = ctx.headers
        // console.log(ua);

        // const cookies = ctx.cookies
        // console.log(cookies);
        // let wa_opens = cookies.get('wa_opens')
        // console.log(wa_opens);
        // cookies.set('wa_opens',Date.now(),{httpOnly: false,overwrite: true,domain:'192.168.43.239:4000'})
        // if(!wa_opens){
        //     cookies.set('wa_opens',Date.now(),{httpOnly: false,overwrite: true})
        // }
    }
}
