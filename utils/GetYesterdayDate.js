const date = new Date(Date.now() - 1000 * 3600 * 24) // 获取昨天的此时此刻
const year = date.getFullYear()
const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

let yesterdayLt = year + '-' + month + '-' + day + ' 00:00:00'
let yesterdayGt = year + '-' + month + '-' + day + ' 23:59:59'
module.exports = [yesterdayLt, yesterdayGt]