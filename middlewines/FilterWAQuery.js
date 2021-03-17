const recordModel = require('../models/Record')
const customModel = require('../models/Custom')
const websiteModel = require('../models/Website')
const clientUtil = require('../utils/ClientUtil')
const api = require('../utils/ApiUtil')

module.exports = async (ctx, next) => {
    const query = ctx.query
    await next()
    if (ctx.path === '/resources/images/wa.gif') {
        const headers = ctx.headers
        if (query.config) {
            if (!query.closeTime) {  // 打开页面
                let ip = ctx.ip
                console.log(ip);
                api.getIpInfo(ip, function (data) {
                    const { device, os, browserName } = clientUtil.getClient(headers['user-agent'], query.appName)
                    const city = data.city
                    const isp = data.isp
                    const record = {
                        config: query.config,
                        open_time: new Date(parseInt(query.openTime)),
                        close_time: null,
                        url: query.url,
                        ip: ip,
                        address: city,
                        service: isp,
                        referrer: query.referrer,
                        wxh: query.width + 'x' + query.height,
                        depth: query.colorDepth,
                        device: device,
                        os: os,
                        browser_name: browserName
                    }
                    recordModel.createRecord(record)
                })
            } else {  // 关闭页面，添加关闭时间字段
                await recordModel.addCloseTime(query.config, new Date(parseInt(query.openTime)), new Date(parseInt(query.closeTime)))
            }
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
    if (ctx.path === '/resources/images/custom.gif') {
        if (query.config && query.track) {
            let custom = {
                config: query.config,
                track: query.track,
                category: query.category || '',
                action: query.action || '',
                label: query.label || '',
                value: query.value || '',
                url: query.url,
                ip: ctx.ip,
                create_time: new Date(),
            }
            await customModel.createCustom(custom)
        }
    }
}
