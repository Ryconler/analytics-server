const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secret = require('../config/token-secret')
const websiteModel = require('../models/Website')


class WebsiteController {
    static async getWebsitesByUId(ctx) {
        const token = ctx.header.authorization.split(' ')[1]  //获取jwt
        if (token) {
            const payload = await jwt.verify(token, secret)  //获取jst的负载信息
            const user = payload.data // 负载信息的data部分为之前签发时的data
            const websites = await websiteModel.getWebsitesByUId(user.id)
            ctx.status = 200
            ctx.body = {
                message: '获取成功',
                websites: websites,
                user:user,
            }
        } else {
            ctx.status = 401
            ctx.body = {
                message: 'token认证错误'
            }
        }
    }

    static async addWebsite(ctx) {
        const token = ctx.header.authorization.split(' ')[1]  //获取jwt
        if (token) {
            const payload = await jwt.verify(token, secret)  //获取jst的负载信息
            const user = payload.data // 负载信息的data部分为之前签发时的data
            const params = ctx.request.body
            if(params.domain&&params.index_url){
                let website={
                    u_id:user.id,
                    unique_id:Math.random().toString(36).substr(2,10), // 随机生成10位的数字英文字符串
                    domain:params.domain,
                    index_url:params.index_url,
                    title:params.title,
                    create_date:new Date().toLocaleString(),
                    validate:'0'
                }
                website = await websiteModel.addWebsite(website)
                ctx.status = 200
                ctx.body = {
                    message: '添加成功',
                    website: website,
                    user:user,
                }
            }
        } else {
            ctx.status = 401
            ctx.body = {
                message: 'token认证错误'
            }
        }
    }



}

module.exports = WebsiteController
