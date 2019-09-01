/* 检验代码是否安装时爬虫使用 */
const baseURL = require('../config/index').baseURL;

module.exports = function (config) {
    return `<script async src="${baseURL}/resources/javascripts/wa.js"></script>
<script>
    window.waData = window.waData || [];
    function waTag(){waData.push(arguments);}
    waTag('config', '${config}');
</script>`
};
