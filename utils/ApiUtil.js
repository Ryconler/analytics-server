const request = require('request')

module.exports.getIpInfo = function (ip, callback) {
    request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function (error, response, body) {
        /*判断请求是否成功*/
        if (!error && response.statusCode === 200) {
            /*把字符串转换为json*/
            console.log(body);
            const json = JSON.parse(body);
            console.log(json);
            /*渲染模板*/
            callback && callback(json.data)
        }
    });
}
/*
this.getIpInfo('')
    .then(res => {
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    })
*/



