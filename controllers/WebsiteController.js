const jwt = require('jsonwebtoken')
const secret = require('../config/tokenSecret')
const request = require('request-promise-native')


const websiteModel = require('../models/Website')
const recordModel = require('../models/Record')
const NormalStatistics = require('./core-analytics/NormalStatistics')



class WebsiteController {
  static async getWebsite(ctx){
    const token = ctx.header.authorization.split(' ')[1]  //获取jwt
    const payload = await jwt.verify(token, secret)  //获取jst的负载信息
    const user = payload.data // 负载信息的data部分为之前签发时的data
    const website = await websiteModel.getWebsite(ctx.params.id)
    if(website && website.u_id===user.id){
      ctx.body={
        website
      }
    }else{
      ctx.status = 401
      ctx.body={
        message: '网站不属于你'
      }
    }
  }

  static async getWebsites(ctx){
    const token = ctx.header.authorization.split(' ')[1]  //获取jwt
    const payload = await jwt.verify(token, secret)  //获取jst的负载信息
    const user = payload.data // 负载信息的data部分为之前签发时的data
    const websites = await websiteModel.getWebsitesByUId(user.id)
    ctx.body={
      websites
    }
  }

  static async getWebsitesOverviewByUId(ctx) {
    const token = ctx.header.authorization.split(' ')[1]  //获取jwt
    const payload = await jwt.verify(token, secret)  //获取jst的负载信息
    const user = payload.data // 负载信息的data部分为之前签发时的data
    const websites = await websiteModel.getWebsitesByUId(user.id)
    for(let website of websites){
      const pvNum = await recordModel.getPVToday(website.track_id)
      const uvNum = await recordModel.getUVToday(website.track_id)
      website.pvNum = pvNum
      website.uvNum = uvNum
    }
    ctx.status = 200
    ctx.body = {
      message: '获取成功',
      websites: websites,
    }
  }

  static async addWebsite(ctx) {
    const token = ctx.header.authorization.split(' ')[1]  //获取jwt
    const payload = await jwt.verify(token, secret)  //获取jst的负载信息
    const user = payload.data // 负载信息的data部分为之前签发时的data
    const params = ctx.request.body
    if (params.host && params.index_url) {
      let website = {
        u_id: user.id,
        track_id: Math.random().toString(36).substr(2, 10), // 随机生成10位的数字英文字符串
        host: params.host,
        index_url: params.index_url,
        title: params.title,
        create_date: new Date().toLocaleString(),
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
    const token = ctx.header.authorization.split(' ')[1]  //获取jwt
    const payload = await jwt.verify(token, secret)  //获取jst的负载信息
    const user = payload.data // 负载信息的data部分为之前签发时的data
    const siteId = ctx.params.id
    const website = await websiteModel.getWebsite(siteId)
    if (website && website.u_id === user.id) {
      try {
        // 通过抓取网站页面，分析是否安装了正确的统计代码
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
      } catch (e) {
        ctx.body = {
          message: '未检测到代码',
        }
      }

    } else {
      ctx.status = 401
      ctx.body = {
        message: '网站不属于你',
      }
    }

  }

  static async getWebsiteStatistics(ctx){
    const siteId = ctx.params.id
    const website = await websiteModel.getWebsite(siteId)
    const normalStatistics = new NormalStatistics(website.track_id)
    website.pvNumTd = normalStatistics.pvNumTd
    website.uvNumTd = normalStatistics.uvNumTd
    website.pvNumYd = normalStatistics.pvNumYd
    website.uvNumYd = normalStatistics.uvNumYd
    ctx.status = 200
    ctx.body = {
      message: '获取成功',
      statistics: website
    }
  }
  static async getPVToday(ctx) {
    const token = ctx.header.authorization.split(' ')[1]
    const payload = await jwt.verify(token, secret)
    const user = payload.data
    const siteId = ctx.params.id
    const website = await websiteModel.getWebsite(siteId)
    if (website && website.u_id === user.id) {
      try {
        const pvNum = await recordModel.getPVToday(website.track_id)
        ctx.body = {
          pvNum
        }
      } catch (e) {
        ctx.status = 500
        ctx.body = {
          message: '内部错误',
        }
      }
    } else {
      ctx.status = 401
      ctx.body = {
        message: '网站不属于你',
      }
    }
  }
  static async getUVToday(ctx) {
    const token = ctx.header.authorization.split(' ')[1]
    const payload = await jwt.verify(token, secret)
    const user = payload.data
    const siteId = ctx.params.id
    const website = await websiteModel.getWebsite(siteId)
    if (website && website.u_id === user.id) {
      try {
        const uvNum = await recordModel.getUVToday(website.track_id)
        ctx.body = {
          uvNum
        }
      } catch (e) {
        ctx.status = 500
        ctx.body = {
          message: '内部错误',
        }
      }
    } else {
      ctx.status = 401
      ctx.body = {
        message: '网站不属于你',
      }
    }
  }
}

module.exports = WebsiteController
