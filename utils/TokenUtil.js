const jwt = require('jsonwebtoken')
const secret = require('../config/tokenSecret')

module.exports.getPayload = function (ctx) {
    const token = ctx.header.authorization.split(' ')[1]  //获取jwt
    return jwt.verify(token, secret)  //获取jst的负载信息
}

module.exports.signToken = function (data) {
    return jwt.sign({data: data, exp: Math.floor(Date.now() / 1000) + 60 * 60}, secret) // 生成token返回客户端
}
