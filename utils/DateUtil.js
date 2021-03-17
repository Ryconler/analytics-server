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
/* 获取时期的年月日 */
module.exports.toDayString = function (time) {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return year + '-' + month + '-' + day
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
    openTime = parseInt(openTime)
    closeTime = parseInt(closeTime)
    return (new Date(closeTime).getTime() - new Date(openTime).getTime()) / 1000
}
/* 获取某天的0点日期 */
module.exports.getDatePre = function (num) {
    const date = new Date(Date.now() - num * 24 * 60 * 60 * 1000)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}
/* 获取某天的23:59:59点日期 */
module.exports.getDateSuf = function (num) {
    const date = new Date(Date.now() - num * 24 * 60 * 60 * 1000)
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setMilliseconds(999)
    return date
}
/* 获取某个时间的0点日期 */
module.exports.getDatePreByDate = function (date) {
    const newDate = new Date(date)
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    return newDate
}
/* 获取某时间的23:59:59点数字 */
module.exports.getDateSufByDate = function (date) {
    const newDate = new Date(date)
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setMilliseconds(999)
    return newDate
}
// console.log(this.getTimePre(28));
// console.log(this.getTimeSuf(28));



// console.log(this.toTimeString(12456789));
