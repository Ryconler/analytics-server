const request = require('request-promise-native')
const tokenUtil = require('../utils/TokenUtil')
const dateUtil = require('../utils/DateUtil')
const dataUtil = require('../utils/DataUtil')
const websiteModel = require('../models/Website')
const recordModel = require('../models/Record')
const customModel = require('../models/Custom')


class WebsiteController {
    static async getWebsite(ctx) {
        const query = ctx.query
        const user = tokenUtil.getPayload(ctx).data // 负载信息的data部分为之前签发时的data
        const website = await websiteModel.getWebsite(ctx.params.id)
        if (website && website.u_id === user.id) {
            if (query.ip) {
                const records = await recordModel.getRecordsByIp(website.config, query.ip)
                const todayPre = dateUtil.getTimePre(0)
                const todaySuf = dateUtil.getTimeSuf(0)
                let allVisit = 0
                let thatDayVisit = 0
                let isOld = false
                records.forEach(record => {
                    allVisit++
                    if (record.open_time >= todayPre && record.open_time <= todaySuf) {
                        thatDayVisit++
                    }
                })
                if (allVisit > 1) {
                    isOld = true
                }
                ctx.body = {
                    status: 2,
                    isOld,
                    thatDayVisit
                }
            } else {
                ctx.body = {
                    status: 2,
                    website
                }
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
                config: 'WA-' + Math.random().toString(36).substr(2, 6).toUpperCase() + '-' + user.id, // 随机生成10位的数字英文字符串加上用户id
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
            }

        }else {
            ctx.body = {
                status: 4,
                message: '添加失败',
            }
        }
    }
    static async updateWebsite(ctx) {
        const website = ctx.request.body
        if (website.id && website.host && website.index_url) {
            await websiteModel.updateWebsite(website)
            ctx.body = {
                status: 2,
                message: '修改成功',
            }
        }else {
            ctx.body = {
                status: 4,
                message: '修改失败',
            }
        }
    }

    static async deleteWebsite(ctx) {
        const config = ctx.params.config
        if (config) {
            websiteModel.deleteWebsiteByConfig(config)
            recordModel.deleteRecordsByConfig(config)
            customModel.deleteCustomByConfig(config)
            ctx.body = {
                status: 2,
                message: '删除成功',
            }
        }else {
            ctx.body = {
                status: 4,
                message: '删除失败',
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
                let htmlString = await request(website.index_url)
                let code = require('../config/waCode')(website.config);  //正确代码
                htmlString = htmlString.replace(/\s|;|"|'+/g, '');  // 去除所有空格和分号和引号
                code = code.replace(/\s|;|"|'+/g, '');
                if (htmlString.indexOf(code) !== -1) {
                    ctx.body = {
                        status: 2,
                        message: '检测到已成功安装',
                    }
                } else {
                    ctx.body = {
                        status: 4,
                        message: '未检测到代码',
                    }
                }
            } catch (e) {
                ctx.body = {
                    status: 4,
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
        const config = ctx.params.config
        const date = ctx.query.date
        if (config && date) {
            const statistics = await dataUtil.getStatisticsByDate(config, date)
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

    static async getCompare(ctx) {
        const config = ctx.params.config
        const days = ctx.query.days
        if (config && days) {
            const compare = await dataUtil.getCompare(config, days)
            ctx.body = {
                status: 2,
                message: '获取成功',
                compare: compare
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }

    }

    static async getLimitRecords(ctx) {
        const config = ctx.params.config
        const page = ctx.query.page
        const limit = 10
        if (config) {
            if (page) {
                const offset = limit * (page - 1)
                const records = await recordModel.getLimitRecords(config, offset, limit)
                records.forEach(record => {
                    const openTime = parseInt(record.open_time)
                    const closeTime = parseInt(record.close_time)
                    const urlsArr = (record.urls || '').split(',')
                    const openTimesArr = (record.open_times || '').split(',')
                    record.open_time = openTime
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
            } else {
                const count = await recordModel.getRecordsCount(config)
                ctx.body = {
                    status: 2,
                    message: '获取成功',
                    count
                }
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }
    }

    static async getONVisitor(ctx) {
        const config = ctx.params.config
        const days = ctx.query.days
        if (config && days) {
            const onvisitor = await dataUtil.getONVisitor(config, days)
            ctx.body = {
                status: 2,
                message: '获取成功',
                onvisitor: onvisitor
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }

    }

    static async getSVisitor(ctx) {
        const config = ctx.params.config
        const days = parseInt(ctx.query.days)
        if (config && days) {
            const svisitor = await dataUtil.getSVisitor(config, days)
            ctx.body = {
                status: 2,
                message: '获取成功',
                svisitor: svisitor
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }

    }

    static async getEventByDate(ctx) {
        const config = ctx.params.config
        const days = ctx.query.days
        if (config && days) {
            const events = await dataUtil.getEvents(config, days)
            ctx.body = {
                status: 2,
                message: '获取成功',
                events: events
            }
        } else {
            ctx.body = {
                status: 4,
                message: '缺少参数'
            }
        }

    }

    static async getEventCompare(ctx) {
        const config = ctx.params.config
        const days = ctx.query.days
        if (config && days) {
            const compare = await dataUtil.getCompare(config, days)
            ctx.body = {
                status: 2,
                message: '获取成功',
                compare: compare
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
