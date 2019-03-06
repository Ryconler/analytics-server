module.exports = function (openTime, closeTime) {
  return (new Date(openTime).getTime() - new Date(closeTime).getTime())/1000
}