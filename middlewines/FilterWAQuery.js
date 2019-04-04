const recordModel = require('../models/Record')
const websiteModel = require('../models/Website')
const clientUtil = require('../utils/ClientUtil')
const api = require('../utils/ApiUtil')

module.exports = async (ctx, next) => {
    await next()
    if (ctx.path === '/resources/images/wa.gif') {
        const query = ctx.query
        const cookies = ctx.cookies
        const headers = ctx.headers
        if (!query.closeTime) {  // 打开页面
            let wa_urls = cookies.get('wa_urls')
            let wa_opens = cookies.get('wa_opens')
            console.log(wa_opens);
            if (wa_urls) {  // 不是第一次请求,添加cookie跟踪页面跳转记录
                ctx.cookies.set('wa_urls', wa_urls + ',' + query.url)
                ctx.cookies.set('wa_opens', wa_opens + ',' + Date.now())
            } else {  // 第一次请求，创建一个记录
                ctx.cookies.set('wa_urls', query.url)
                ctx.cookies.set('wa_opens', query.openTime)
                const {device, os, browserName} = clientUtil.getClient(headers['user-agent'],query.appName)
                const record = {
                    config: query.config || 'unknown',
                    open_time: query.openTime,
                    url: query.url,
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
            }
        } else {  // 关闭页面，获取cookie记录信息，更新记录
            await recordModel.updateRecord(query.config, query.openTime, query.closeTime, ctx.cookies.get('wa_urls'), ctx.cookies.get('wa_opens'))
        }
    }

    if(ctx.path === '/resources/images/test.gif'){
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
