const request = require('request-promise-native')
const tokenUtil = require('../utils/TokenUtil')
const dateUtil = require('../utils/DateUtil')
const dataUtil = require('../utils/DataUtil')
const websiteModel = require('../models/Website')
const recordModel = require('../models/Record')


class WebsiteController {
    static async getWebsite(ctx) {
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const website = await websiteModel.getWebsite(ctx.params.id)
        if (website && website.u_id === user.id) {
            ctx.body = {
                status: 2,
                website
            }
        } else {
            ctx.body = {
                status: 4,
                message: '网站不属于你'
            }
        }
    }

    static async getWebsites(ctx) {
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const websites = await websiteModel.getWebsitesByUId(user.id)
        ctx.body = {
            status: 2,
            websites
        }
    }

    static async addWebsite(ctx) {
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const params = ctx.request.body
        if (params.host && params.index_url) {
            let website = {
                u_id: user.id,
                config: 'WA-' + Math.random().toString(36).substr(2, 10).toUpperCase() + '-' + user.id, // 随机生成10位的数字英文字符串加上用户id
                host: params.host,
                index_url: params.index_url,
                title: params.title,
                create_date: dateUtil.getNowTime(),
                validate: '0'
            }
            website = await websiteModel.addWebsite(website)
            ctx.body = {
                status: 2,
                message: '添加成功',
                website: website,
                user: user,
            }

        }
    }

    static async validateWebsite(ctx) {
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const siteId = ctx.params.id
        const website = await websiteModel.getWebsite(siteId)
        if (website && website.u_id === user.id) {
            /* 通过抓取网站页面，分析是否安装了正确的统计代码 */
            try {
                let htmlString = await request('http://' + website.index_url)
                let code = require('../config/waCode')(website.config);  //正确代码
                htmlString = htmlString.replace(/\s|;+/g, '');  // 去除所有空格和分号
                code = code.replace(/\s|;+/g, '');
                if (htmlString.indexOf(code) !== -1) {
                    ctx.body = {
                        status: 2,
                        message: '检测到已成功安装',
                    }
                } else {
                    ctx.body = {
                        status: 2,
                        message: '未检测到代码',
                    }
                }
            } catch (e) {
                ctx.body = {
                    status: 2,
                    message: '未检测到代码',
                }
            }
        } else {
            ctx.body = {
                status: 4,
                message: '网站不属于你',
            }
        }

    }

    static async getOverview(ctx) {
        const user = tokenUtil.getPayload(ctx).data
        const overview = await dataUtil.getOverview(user.id)
        ctx.body = {
            status: 2,
            message: '获取成功',
            user,
            overview
        }
    }

    static async getStatisticsByDate(ctx) {
        const siteId = ctx.params.id
        const date = ctx.query.date
        if (siteId && date) {
            const statistics = await dataUtil.getStatisticsByDate(siteId, date)
            ctx.body = {
                status: 2,
                message: '获取成功',
                statistics: statistics
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }

    }

    static async getLimitRecords(ctx) {
        const siteId = ctx.params.id
        const page = ctx.query.page
        const limit = 10
        const offset = limit * (page - 1)
        if (siteId && page) {
            const website = await websiteModel.getWebsite(siteId)
            if (website) {
                const records = await recordModel.getLimitRecords(website.config, offset, limit)
                records.forEach(record => {
                    const openTime = parseInt(record.open_time)
                    const closeTime = parseInt(record.close_time)
                    const urlsArr = (record.urls || '').split(',')
                    const openTimesArr = (record.open_times || '').split(',')
                    record.open_time = dateUtil.toTimeString(openTime)
                    record.duration = closeTime ? dateUtil.toMinutesString((closeTime - openTime) / 1000) : '正在访问'
                    record.visitPages = urlsArr.length
                    record.urls = urlsArr
                    record.open_times = openTimesArr
                })
                ctx.body = {
                    status: 2,
                    message: '获取成功',
                    records
                }
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }
    }

    static async getIpInfo(ctx) {
        const siteId = ctx.params.id
        const ip = ctx.query.ip
        if (siteId && ip) {
            const website = await websiteModel.getWebsite(siteId)
            const records = await recordModel.getRecordsByIp(website.config, ip)
            const todayPre = dateUtil.getTimePre(0)
            const todaySuf = dateUtil.getTimeSuf(0)
            let isOld = false
            let todayVisit = 0
            records.forEach(record => {
                if(record.ip === ip){
                    isOld = true
                }
                if (record.open_time >= todayPre && record.open_time <= todaySuf) {
                    todayVisit ++
                }
            })
            ctx.body = {
                status: 2,
                isOld,
                todayVisit
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }
    }

}

module.exports = WebsiteController
