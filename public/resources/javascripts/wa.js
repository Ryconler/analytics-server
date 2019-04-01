(function () {
    const dateNow = Date.now()

    /* 时间转化 */
    function getTimeString(dateTime) {
        const date = new Date(dateTime)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }

    /* cookie */
    function setCookie(key, value) {
        let date = new Date()
        date.setTime(dateNow + 24 * 3600 * 1000); // 一天后
        document.cookie = key + "=" + value + ";expires=" + date.toUTCString()  //设置cookie，默认失效时间为一天
    }

    function getCookie(key) {
        let cookies = document.cookie.split(';')
        for (let cookie of cookies) {
            let c = cookie.trim()
            if (c.indexOf(key + '=') !== -1) {
                return c.slice(key.length + 1, c.length)
            }
        }
        return ''
    }

    function delCookie(key) {
        let date = new Date(); //获取当前时间
        date.setTime(dateNow - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toUTCString();//设置cookie
    }

    /* params拼接 */
    function params2string(params) {
        let args = '';
        for (let p in params) {
            if (args !== '') {  //最后一个参数后不用加&
                args += '&';
            }
            args += p + '=' + encodeURIComponent(params[p]);  //encodeURIComponent:编码URL带参数
        }
        return args
    }


    let params = {};
    /* 网站标识 */
    _wa.forEach(function (item) {
        if (item[0] === 'config') {
            params.config = item[1];
        }
    })
    /* 使用cookie记录页面跳转的历史 */
    /*
    let key = 'wa_open'
    if (!sessionStorage.getItem(key)) {  // 关闭过浏览器或者第一次打开,sessionStorage没有记录
        sessionStorage.setItem(key, dateNow.toString())  // 添加sessionStorage记录
        delCookie(key)  // 删除上次打开时记录的cookie
    }
    let history = getCookie(key)
    history = history ? history + ',' + dateNow : dateNow
    setCookie(key, history)
     */
    let key = 'wa_open'
    if (!sessionStorage.getItem(key)) {  // 关闭过浏览器或者第一次打开,sessionStorage没有记录
        sessionStorage.setItem(key, dateNow.toString())  // 添加sessionStorage记录
        /* 第一次打开记录额外信息 */
        //Window对象
        if (window && window.screen) {
            params.host = window.location.host || '';  // host
            params.width = window.screen.width || 0;  //显示器屏幕宽度
            params.height = window.screen.height || 0;  //显示器屏幕高度
            params.colorDepth = window.screen.colorDepth || 0;// 颜色深度
        }
        //Navigator浏览器对象
        if (navigator) {
            params.userAgent = navigator.userAgent || '';  //客户机发送服务器的 user-agent 头部的值
            params.appName = navigator.appName
            params.appVersion = navigator.appVersion
        }
    }
    //Document对象数据
    if (document) {
        params.url = document.URL || '';
        params.referrer = document.referrer || '';  //上一页url
    }
    params.openTime = sessionStorage.getItem(key) // 页面打开时间为第一次打开时间

    /* 发送打开页面后的请求 */
    //通过Image对象请求后端脚本,实现跨域请求自己的服务器
    new Image(1, 1).src = 'http://127.0.0.1:4000/resources/images/wa.gif?' + params2string(params);

    /* 关闭页面再发送一次关闭请求 */
    window.onbeforeunload = () => {
        let closeParams = {}
        closeParams.openTime = sessionStorage.getItem(key)
        closeParams.config = params.config
        closeParams.closeTime = Date.now().toString()
        new Image(1, 1).src = 'http://127.0.0.1:4000/resources/images/wa.gif?' + params2string(closeParams) ;
    }
})();

