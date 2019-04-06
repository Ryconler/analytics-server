/* 检验代码是否安装时爬虫使用 */
module.exports = function (config) {
    return `_wa.push(['config', '${config}']);
var newScript = document.createElement('script');
newScript.async = true;
newScript.src = 'http://analytics.server.jessezhu.cn/resources/javascripts/wa.js';
var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(newScript, firstScript);`
};
