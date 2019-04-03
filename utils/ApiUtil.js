const request = require('request')
const iconv = require('iconv-lite')

module.exports.getIpInfo = function (ip,callback) {
    const options = {
        url: 'http://ip.cz88.net/data.php?ip='+ip,
        headers: {
            'Vary':'Accept-Encoding',
            'Content-Encoding':'gzip',
            "Content-Type": "text/html; charset=utf-8",
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
        }
    }
    request(options, function (err, res,body) {
        if (!err) {
            // console.log(res);
            const content = body.split(`','`)
            // console.log(content[1]);
            callback&&callback(content[1])
        }
    })
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



