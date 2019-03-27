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
                website
            }
        } else {
            ctx.status = 401
            ctx.body = {
                message: '网站不属于你'
            }
        }
    }

    static async getWebsites(ctx) {
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const websites = await websiteModel.getWebsitesByUId(user.id)
        ctx.body = {
            websites
        }
    }

    static async addWebsite(ctx) {
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const params = ctx.request.body
        if (params.host && params.index_url) {
            let website = {
                u_id: user.id,
                track_id: Math.random().toString(36).substr(2, 10), // 随机生成10位的数字英文字符串
                host: params.host,
                index_url: params.index_url,
                title: params.title,
                create_date: dateUtil.getNowTime(),
                validate: '0'
            }
            website = await websiteModel.addWebsite(website)
            ctx.status = 200
            ctx.body = {
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
            let htmlString = await request('http://' + website.index_url)
            let code = require('../config/waCode')(website.track_id);  //正确代码
            htmlString = htmlString.replace(/\s|;+/g, '');  // 去除所有空格和分号
            code = code.replace(/\s|;+/g, '');
            if (htmlString.indexOf(code) !== -1) {
                ctx.body = {
                    message: '检测到已成功安装',
                }
            } else {
                ctx.body = {
                    message: '未检测到代码',
                }
            }
        } else {
            ctx.status = 403
            ctx.body = {
                message: '网站不属于你',
            }
        }

    }

    static async getOverview(ctx) {
        const user = tokenUtil.getPayload(ctx).data
        const overview = await dataUtil.getOverview(user.id)
        ctx.body = {
            message: '获取成功',
            user,
            overview: overview,
        }
    }

    static async getStatisticsByDate(ctx) {
        const siteId = ctx.params.id
        const date = ctx.query.date
        if (siteId && date) {
            const statistics = await dataUtil.getStatisticsByDate(siteId, date)
            ctx.body = {
                message: '获取成功',
                statistics: statistics
            }
        } else {
            ctx.status = 400
            ctx.body = {
                message: '缺少参数'
            }
        }

    }

}

module.exports = WebsiteController
