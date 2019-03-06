const recordModel = require('../../models/Record')

let recordsTd,recordsYd,pvNumTd,pvNumYd,uvNumTd,uvNumYd
async function init() {
  recordsTd = await recordModel.getRecordsToday(trackId) // 今日该网站的所有记录
  recordsYd = await recordModel.getRecordsYesterday(trackId) // 昨日该网站的所有
  pvNumTd = recordsTd.length // 今日PV
  pvNumYd = recordsYd.length // 昨日PV
  uvNumTd = await recordModel.getUVToday(trackId)
  uvNumYd = await recordModel.getUVYesterday(trackId)
}
// init()

function NormalStatistics(trackId) {
  this.pvNumTd = 100 // 今日PV
  this.pvNumYd = 100 // 昨日PV
  this.uvNumTd = 100
  this.uvNumYd = 100
}

module.exports = NormalStatistics
