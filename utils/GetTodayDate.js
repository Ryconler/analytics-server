const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

let todayLt = year + '-' + month + '-' + day + ' 00:00:00'
let todayGt = year + '-' + month + '-' + day + ' 23:59:59'
module.exports = [todayLt, todayGt]