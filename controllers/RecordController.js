const request = require('request-promise-native')
const tokenUtil = require('../utils/TokenUtil')
const dateUtil = require('../utils/DateUtil')
const dataUtil = require('../utils/DataUtil')
const websiteModel = require('../models/Website')
const recordModel = require('../models/Record')


class RecordController {
    static async getMore(ctx) {
        const recordId = ctx.params.id
        const record = await recordModel.getRecordById(recordId)
        if (record) {
            const ip = record.ip
            const dayPre = dateUtil.getDatePreByDate(record.open_time)
            const daySuf = dateUtil.getDateSufByDate(record.open_time)
            let allVisit = 0
            let thatDayVisit = 0
            let isOld = false
            const records = await recordModel.getRecordsByIp(record.config, ip)
            records.forEach(record => {
                allVisit++
                if (record.open_time >= dayPre && record.open_time <= daySuf) {
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
                status: 4,
                message: '缺少参数'
            }
        }
    }

}

module.exports = RecordController
