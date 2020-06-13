const request = require('request')

module.exports.getIpInfo = function (ip, callback) {
    callback && callback({});
    return;
    // 淘宝ip查询接口已失效
    request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function (error, response, body) {
        /*判断请求是否成功*/
        if (!error && response.statusCode === 200) {
            /*把字符串转换为json*/
            const json = JSON.parse(body);
            /*渲染模板*/
            callback && callback(json.data)
        }
    });
}


