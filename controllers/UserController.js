const userModel = require('../models/User')
const registerValidator = require('../utils/Validator').register  //自定义的必填字段验证器
const tokenUtil = require('../utils/TokenUtil')
const pswUtil = require('../utils/PasswordUtil')
const dateUtil = require('../utils/DateUtil')

class UserController {
    static async login(ctx) {
        const params = ctx.request.body
        if (params.username && params.password) {
            const user = await userModel.getUserByUsername(params.username)  //获取数据库中的用户
            if (user) {  //用户存在
                const password = user.password
                if (await pswUtil.compare(params.password,password)) {  //验证密码
                    delete user.password
                    ctx.status = 200
                    ctx.body = {
                        message: '登录成功',
                        user: user,
                        token: tokenUtil.signToken(user)
                    }
                } else {
                    ctx.status = 403
                    ctx.body = {
                        message: '密码错误',
                    }
                }
            } else {  //用户不存在
                ctx.status = 403
                ctx.body = {
                    message: '用户不存在',
                }
            }
        } else {
            ctx.status = 400
            ctx.body = {
                message: '来自服务器：必填字段有误',
            }
        }

    }

    static async register(ctx) {
        const params = ctx.request.body
        if (registerValidator(params.username, params.password, params.email)) {
            const user = await userModel.getUserByUsername(ctx.request.body.username)  //获取数据库中的用户
            if (user) {  //用户已存在
                ctx.status = 403
                ctx.body = {
                    message: '用户名已存在',
                }
            } else {  //用户不存在，可以创建
                let user = {
                    username: params.username,
                    password: await pswUtil.hash(params.password),
                    email: params.email,
                    register_date: dateUtil.getNowTime()
                }
                user = await userModel.createUser(user)
                delete user.password
                ctx.status = 200
                ctx.body = {
                    message: '注册成功',
                    user: user,
                    token: tokenUtil.signToken(user)
                }
            }
        } else {
            ctx.status = 400
            ctx.body = {
                message: '来自服务器：必填字段有误',
            }
        }
    }

    static async getUsername(ctx) {
        const params = ctx.request.body
        if (params.username) {
            const user = await userModel.getUserByUsername(params.username)  //获取数据库中的用户
            if (user) {  //用户存在
                ctx.status = 403
                ctx.body = {
                    message: '用户名已存在',
                }
            } else {  //用户不存在
                ctx.status = 200
                ctx.body = {
                    message: '用户不存在，可以注册',
                }
            }
        } else {
            ctx.status = 400
            ctx.body = {
                message: '来自服务器：必填字段有误',
            }
        }

    }

    static async getUser(ctx) {
        const payload = tokenUtil.getPayload(ctx)
        ctx.status = 200
        ctx.body = {
            message: '认证成功',
            user: payload.data // 负载信息的data部分为之前签发时的data
        }
    }


}

module.exports = UserController
