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

// error handler
onerror(app)

// middlewares
app.use(logger())
app.use(require('./middlewines/GetQuery'))   //解析请求query参数
app.use(bodyparser({enableTypes: ['json', 'form', 'text']}))

app.use(require('./middlewines/TokenError'))  //没有进行token验证的错误处理
app.use(
    jwt({ secret: require('./config/token-secret') })  // 自定义密钥配置token的加密
    .unless({path:[/^\/resources/,
            /^\/api\/test/,
            /^\/api\/users\/login/,
            /^\/api\/users\/register/]})  // 请求这些url不需要token验证(正则表达式:/^xxx/表示以xxx开头)
) //token验证设置

app.use(cors({
    origin: 'http://localhost:8080', //只允许 http://localhost:8080 这个域名的请求
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))  //给前端的跨域请求设置

app.use(statics(__dirname + '/public'))
app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

/*  打印时间
app.use(async (ctx, next) => {
  const date = new Date()
  console.log(`${date.toLocaleString()}`)
  await next()
})
*/

// routes
app.use(index.routes(), index.allowedMethods())
app.use(api.routes(), api.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


module.exports = app
