const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const statics=require('koa-static')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const jwt=require('koa-jwt')

const index = require('./routes/index')
const api = require('./routes/api')

/* 使用了反向代理，保证后面可以获取真实ip地址 */
app.proxy = true
/* 错误处理 */
onerror(app)
app.use(require('./middlewines/CatchError'))
/* 日志 */
app.use(logger())
/* 跨域设置 */
app.use(cors({
    origin: require('../config/index').baseURL,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,  // 跨域cookie
    allowMethods: ['GET', 'POST','PUT','DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
/* 数据统计中间件 */
app.use(require('./middlewines/FilterWAQuery'))
/* token验证设置，踩坑，一定要先设置跨域再设置token，不然options请求永远不通过！！！ */
app.use(require('./middlewines/TokenError'))  //没有进行token验证的错误处理
const unlessURL = [
    /^\/resources/,
    /^\/api\/test/,
    /^\/api\/users\/login/,
    /^\/api\/users\/register/,
    /^\/api\/users\/username/,
]  //不用进行token验证的url
app.use(jwt({ secret: require('./config/tokenSecret') }).unless({path: unlessURL}))
/* 静态资源 */
app.use(statics(__dirname + '/public'))
/* 默认视图渲染 */
app.use(views(__dirname + '/views', {extension: 'pug'}))
/* post提交数据body解析 */
app.use(bodyparser({enableTypes: ['json', 'form', 'text']}))
/* API路由 */
app.use(index.routes(), index.allowedMethods())
app.use(api.routes(), api.allowedMethods())

module.exports = app
