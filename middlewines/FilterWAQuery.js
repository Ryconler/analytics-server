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
        if (!query.closeTime && query.config) {  // 打开页面
            if (query.first === '1') {  // 第一次打开，创建记录
                let ip = ctx.ip
                console.log(ip);
                if (ip.indexOf('127.0.0.1') === -1) {  // 获得了真实地址
                    api.getIpInfo(ip, function (data) {
                        const {device, os, browserName} = clientUtil.getClient(headers['user-agent'], query.appName)
                        const record = {
                            config: query.config,
                            open_time: query.openTime,
                            open_times: query.openTime,
                            close_time: '',
                            url: query.url,
                            urls: query.url,
                            ip: ip,
                            address: (data.city.toLowerCase() === '' || 'xx')?'未知':data.city,
                            service: (data.isp.toLowerCase() === '' || 'xx')?'未知':data.isp,
                            referrer: query.referrer,
                            wxh: query.width + 'x' + query.height,
                            depth: query.colorDepth,
                            device: device,
                            os: os,
                            browser_name: browserName
                        }
                        recordModel.createRecord(record)
                    })
                }
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
                time: Date.now(),
            }
            await customModel.createCustom(custom)
        }
    }
}
