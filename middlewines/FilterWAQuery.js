const recordModel = require('../models/Record')
const websiteModel = require('../models/Website')
const client = require('../utils/GetClientInfo')

module.exports = async (ctx, next) => {
  await next()
  if (ctx.path === '/resources/images/wa.gif') {
    const query = ctx.query
    const website = await websiteModel.getWebsiteByTrackId(query.account)
    if (website && website.host === query.host) {  // 判断该TrackId是否属于该域名
      const {device, os} = client.getDeviceAndOS(query.userAgent)
      const {browserName, browserVersion} = client.getBrowserInfo(query.userAgent, query.appName, query.appVersion)
      const record = {
        track_id: query.account || 'unknown',
        open_time: query.openTime,
        close_time: query.closeTime,
        ip: ctx.ip,
        url: query.url,
        referrer: query.referrer,
        wxh: query.width + 'x' + query.height,
        depth: query.colorDepth,
        device: device,
        os: os,
        browser_name: browserName,
        browser_version: browserVersion
      }
      recordModel.createRecord(record)
    }
  }
}
