const router = require('koa-router')()
const testCtrl=require('../controllers/TestController')
const userCtrl=require('../controllers/UserController')
const webCtrl=require('../controllers/WebsiteController')
const recordCtrl=require('../controllers/RecordController')
const analCtrl=require('../controllers/AnalyticsController')

router.prefix('/api')

/* test */
router.get('/test/:id', testCtrl.getJson)
router.post('/test', testCtrl.postJson)
/* 用户部分 */
router.get('/users/user', userCtrl.getUser)  // 获取单个用户所有信息
router.post('/users/login', userCtrl.login)  // 登录验证（无需token验证）
router.post('/users/register', userCtrl.register)  // 注册验证（无需token验证）
router.post('/users/username', userCtrl.getUsername)  // 注册是获取用户名是否被注册 （无需token验证）

/* 网站部分 */
router.get('/websites/website/:id',webCtrl.getWebsite) // 获取某个具体网站
router.get('/websites/user',webCtrl.getWebsites)  // 获取用户所有网站
router.get('/websites/website/validate/:id',webCtrl.validateWebsite) // 检查网站代码是否安装正确
router.get('/websites/overview', webCtrl.getOverview)  // 获取单个用户所有网站总览信息
router.get('/websites/website/statistics/:config',webCtrl.getStatisticsByDate)  // 获取具体网站的概况统计
router.get('/websites/website/compare/:config',webCtrl.getCompare)  // 获取具体网站在某个时间段的比较信息
router.get('/websites/website/records/:config', webCtrl.getLimitRecords)  // 获取某个网站的所有记录
router.get('/websites/website/novisitor/:config',webCtrl.getONVisitor)  // 获取具体网站在某个时间段的新旧访客信息
router.get('/websites/website/svisitor/:config',webCtrl.getSVisitor)  // 获取具体网站的用户存留信息
router.post('/websites/website', webCtrl.addWebsite)  // 添加一个网站

/* 记录部分 */
router.get('/records/more/:id',recordCtrl.getMore)  // 获取某个记录的更多信息


module.exports = router
