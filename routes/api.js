const router = require('koa-router')()
const testCtrl=require('../controllers/TestController')
const userCtrl=require('../controllers/UserController')

router.prefix('/api')

router.get('/test', testCtrl.getJson)

/* 用户部分 */
router.get('/users/user', userCtrl.getUser)  // 获取单个用户所有信息
router.post('/users/login', userCtrl.login)  // 登录验证（无需token验证）
router.post('/users/register', userCtrl.register)  // 注册验证（无需token验证）


module.exports = router
