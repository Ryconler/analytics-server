const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secret = require('../config/token-secret')
const userModel = require('../models/User')
const registerValidator = require('../middlewines/Validator').register  //自定义的必填字段验证器

class UserController {
    async login(ctx) {
        const params = ctx.request.body
        if (params.username&&params.password) {
            const user = await userModel.getUserByUsername(params.username)  //获取数据库中的用户
            if (user) {  //用户存在
                const password = user.password
                if (await bcrypt.compare(params.password, password)) {  //验证密码
                    ctx.status = 200
                    ctx.body = {
                        message: '登录成功',
                        user: user,
                        // 生成token返回客户端
                        token: jwt.sign({data: user, exp: Math.floor(Date.now() / 1000) + 60 * 60}, secret)
                    }
                } else {
                    ctx.status = 401
                    ctx.body = {
                        message: '密码错误',
                    }
                }
            } else {  //用户不存在
                ctx.status = 401
                ctx.body = {
                    message: '用户不存在',
                }
            }
        } else {
            ctx.status = 401
            ctx.body = {
                message: '来自服务器：必填字段有误',
            }
        }

    }

    async register(ctx) {
        const params = ctx.request.body
        if (registerValidator(params.username, params.password,params.email)) {
            const user = await userModel.getUserByUsername(ctx.request.body.username)  //获取数据库中的用户
            if (user) {  //用户已存在
                ctx.status = 401
                ctx.body = {
                    message: '用户名已存在',
                }
            } else {  //用户不存在，可以创建
                const newUser = {
                    username: params.username,
                    password: await bcrypt.hash(params.password, 10),  //加密的密码
                    email: params.email,
                    register_date: new Date().toLocaleString()
                }
                const user = await userModel.createUser(newUser)
                if (user) {  //创建成功
                    ctx.status = 200
                    ctx.body = {
                        message: '注册成功',
                        user: user,
                        // 生成token返回客户端
                        token: jwt.sign({data: user, exp: Math.floor(Date.now() / 1000) + 60 * 60}, secret)
                    }
                } else {
                    ctx.status = 500
                    ctx.body = {
                        message: '注册失败',
                    }
                }
            }
        } else {
            ctx.status = 401
            ctx.body = {
                message: '来自服务器：必填字段有误',
            }
        }
    }


    async getUser(ctx) {
        const token = ctx.header.authorization.split(' ')[1]  //获取jwt
        if (token) {
            let payload = await jwt.verify(token, secret)  //获取jst的负载信息
            // console.log(payload);
            ctx.status = 200
            ctx.body = {
                message: '认证成功',
                user:payload.data // 负载信息的data部分为之前签发时的data
            }
        } else {
            ctx.status = 401
            ctx.body = {
                message: 'token认证错误'
            }
        }
    }


}

module.exports = new UserController()
