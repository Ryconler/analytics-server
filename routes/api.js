const router = require('koa-router')()
const testCtrl=require('../controllers/TestController')
const userCtrl=require('../controllers/UserController')
const webCtrl=require('../controllers/WebsiteController')

router.prefix('/api')

router.get('/test', testCtrl.getJson)

/* 用户部分 */
router.get('/users/user', userCtrl.getUser)  // 获取单个用户所有信息
router.post('/users/login', userCtrl.login)  // 登录验证（无需token验证）
router.post('/users/register', userCtrl.register)  // 注册验证（无需token验证）
router.post('/users/username', userCtrl.getUsername)  // 注册是获取用户名是否被注册 （无需token验证）

/* 网站部分 */
router.get('/websites/overview/user', webCtrl.getWebsitesOverviewByUId)  // 获取单个用户所有网站总览信息
router.post('/websites/website', webCtrl.addWebsite)  // 添加一个网站
router.get('/websites/website/validate/:id',webCtrl.validateWebsite) // 检查网站代码是否安装正确
router.get('/websites/website/pv-today/:id',webCtrl.getPVToday) // 获取网站当日PV

module.exports = router
