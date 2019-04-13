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
/* 指定数字时间转字符串 */
module.exports.toTimeString = function (time) {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
/* 秒数转字符串 */
module.exports.toMinutesString = function (seconds) {
    let time = ''
    seconds = parseInt(seconds)
    if (seconds > 59) {
        let minutes = Math.floor(seconds / 60)
        seconds = seconds % 60
        time = minutes + `′` + seconds + `″`
    } else {
        time = seconds + `″`
    }
    return time
}
/* 获取两个字符串时间的秒数差 */
module.exports.getDiffSeconds = function (openTime, closeTime) {
    return (new Date(closeTime).getTime() - new Date(openTime).getTime()) / 1000
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
/* 获取某天的0点数字 */
module.exports.getTimePre = function (num) {
    const date = new Date(Date.now() - num * 24 * 60 * 60 * 1000)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const milliseconds = date.getMilliseconds()
    // console.log(new Date('2019-03-29 00:00:00').getTime());
    return date.getTime() - milliseconds - seconds * 1000 - minutes * 60 * 1000 - hours * 60 * 60 * 1000
}
/* 获取某天的23:59:59点数字 */
module.exports.getTimeSuf = function (num) {
    const date = new Date(Date.now() - num * 24 * 60 * 60 * 1000)
    const hours = 23 - date.getHours()
    const minutes = 59 -date.getMinutes()
    const seconds = 59 - date.getSeconds()
    const milliseconds =  date.getMilliseconds()
    // console.log(new Date('2019-03-29 23:59:59').getTime());
    return date.getTime() - milliseconds + seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000
}
/* 获取某个时间的0点数字 */
module.exports.getTimePreByTime = function (time) {
    const date = new Date(time)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const milliseconds = date.getMilliseconds()
    // console.log(new Date('2019-03-29 00:00:00').getTime());
    return time - milliseconds - seconds * 1000 - minutes * 60 * 1000 - hours * 60 * 60 * 1000
}
/* 获取某时间的23:59:59点数字 */
module.exports.getTimeSufByTime = function (time) {
    const date = new Date(time)
    const hours = 23 - date.getHours()
    const minutes = 59 -date.getMinutes()
    const seconds = 59 - date.getSeconds()
    const milliseconds =  date.getMilliseconds()
    // console.log(new Date('2019-03-29 23:59:59').getTime());
    return time - milliseconds + seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000
}
// console.log(this.getTimePre(1));
// console.log(this.getTimeSuf(1));
// console.log(this.toTimeString(12456789));
