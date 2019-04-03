(function () {
    const dateNow = Date.now()
    const server = 'http://127.0.0.1:4000'

    /* cookie */
    function setCookie(key, value) {
        document.cookie = key + "=" + value  //不设置过期时间，默认为关闭浏览器后清除（关闭标签页不清除）
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

    /* 获取用户的ip和地区信息 */
    function getAddress(callback) {
        const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHttp")
        const url = 'https://api.ttt.sh/ip/qqwry/?type=txt'
        xhr.open("get", url, true);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const res = xhr.responseText.split(',')
                const ip = res[0] || '未知'
                const address = res[1].split(' ')[0] || '未知'
                const service = res[1].split(' ')[1] || '未知'
                callback && callback([ip, address, service])
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                const ip = '未知'
                const address = '未知'
                const service = '未知'
                callback && callback([ip, address, service])
            }
        }
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
    const key = 'wa_open'
    /* 网站标识 */
    _wa.forEach(function (item) {
        if (item[0] === 'config') {
            params.config = item[1];
        }
    })
    const openTime = getCookie(key)
    /* 每次都要记录的信息 */
    params.url = document.URL || '';
    params.openTime = openTime || dateNow.toString() // 页面打开时间为第一次打开时间，用于进行追踪
    if (!openTime) {  // 关闭过浏览器或者第一次打开,cookie没有记录
        setCookie(key, dateNow.toString())  // 设置cookie
        /* 只有第一次打开要记录的信息 */
        if (window && window.screen) {
            params.host = window.location.host || '';  // host
            params.width = window.screen.width || 0;  //显示器屏幕宽度
            params.height = window.screen.height || 0;  //显示器屏幕高度
            params.colorDepth = window.screen.colorDepth || 0;// 颜色深度
        }
        if (navigator) {
            params.userAgent = navigator.userAgent;  //客户机发送服务器的 user-agent 头部的值
            params.appName = navigator.appName
            params.appVersion = navigator.appVersion
        }
        params.referrer = document.referrer || '';  //上一页url，访问来源
        getAddress(function (data) {
            params.ip = data[0]
            params.address = data[1]
            params.province = data[2]
            new Image(1, 1).src = server + '/resources/images/wa.gif?' + params2string(params);
        })
    } else {  // 不是第一次打开
        new Image(1, 1).src = server + '/resources/images/wa.gif?' + params2string(params);
    }

    /* 关闭页面再发送一次关闭请求 */
    window.onbeforeunload = () => {
        let closeParams = {}
        closeParams.openTime = getCookie(key)
        closeParams.config = params.config
        closeParams.closeTime = Date.now().toString()
        new Image(1, 1).src = server + '/resources/images/wa.gif?' + params2string(closeParams);
    }
})();

