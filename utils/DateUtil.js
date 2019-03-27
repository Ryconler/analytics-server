/* 获取当前时间字符串 */
module.exports.getNowTime = function () {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
/* 获取两个时间的秒数差 */
module.exports.getDiffSeconds = function (openTime,closeTime) {
    return (new Date(openTime).getTime() - new Date(closeTime).getTime())/1000
}
/* 获取某天的0点字符串 */
module.exports.getDatePre = function (num) {
    const date = new Date(Date.now() - num * 24 * 60 * 60 * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return year + '-' + month + '-' + day + ' 00:00:00'
}
/* 获取某天的12点字符串 */
module.exports.getDateSuf = function (num) {
    const date = new Date(Date.now() - num * 24 * 60 * 60 * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return year + '-' + month + '-' + day + ' 23:59:59'
}
