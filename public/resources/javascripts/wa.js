(function () {
    const server = 'http://analytics.wzmxx.com';
    // const server = 'http://127.0.0.1:4000'
    const dateNow = Date.now()
    const params = {};
    /* 网站标识 */
    waData.forEach(function (item) {
        if (item[0] === 'config') {
            params.config = item[1];
        }
    })
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

    /* 获取用户的ip和地区信息（已弃用） */
    function getAddress(callback) {
        const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHttp")
        const url = 'https://api.ttt.sh/ip/qqwry'
        xhr.open("get", url, true);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                const ip = res.ip || '未知'
                const location = decodeURIComponent(res.address)
                const address = location.split(' ')[0] || '未知'
                const service = location.split(' ')[1] || '未知'
                callback && callback([ip, address, service])
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                const ip = '未知'
                const address = '未知'
                const service = '未知'
                callback && callback([ip, address, service])
            }
        }
    }

    function getAddress2(callback) {
        const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHttp")
        const url = 'http://ip.taobao.com/service/getIpInfo2.php'
        xhr.open("post", url, true);
        xhr.send('ip=myip');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
                // callback && callback([ip, address, service])
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                const ip = '未知'
                const address = '未知'
                const service = '未知'
                // callback && callback([ip, address, service])
            }
        }
    }


    /* 为waData设置代理 */
    function proxy() {
        waData = new Proxy(waData, {
            set: function (target, property, value) {
                if (value && typeof value === 'object' && value[0] && value[1]) {
                    let customParams = {
                        track: value[0],
                        category: value[1],
                        action: value[2] || '',
                        label: value[3] || '',
                        value: value[4] || '',
                        config: params.config,
                        url: document.URL,
                    }
                    let img = new Image(0, 0)
                    img.src = server + '/resources/images/custom.gif?' + params2string(customParams)
                }
                return true
            }
        })
    }


    /* 初始化 */
    function init() {
        let image = new Image(0, 0)
        params.url = document.URL
        params.openTime = Date.now()
        params.referrer = document.referrer //
        params.host = window.location.host
        params.width = window.screen.width || '';  //显示器屏幕宽度
        params.height = window.screen.height || '';  //显示器屏幕高度
        params.colorDepth = window.screen.colorDepth || '';// 颜色深度
        params.appName = navigator.appName
        console.log(params);
        image.src = server + '/resources/images/wa.gif?' + params2string(params);

        // 移动端关闭页面事件
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                const closeParams = {
                    openTime: params.openTime,
                    config: params.config,
                    closeTime: Date.now()
                }
                image.src = server + '/resources/images/wa.gif?' + params2string(closeParams);
            }
        })
        // PC端关闭页面事件
        window.onbeforeunload = function () {
            const closeParams = {
                openTime: params.openTime,
                config: params.config,
                closeTime: Date.now()
            }
            image.src = server + '/resources/images/wa.gif?' + params2string(closeParams);
        }
    }

    init()
    proxy()

    /*
    getAddress(function (data) {
        init(data)
        proxy(data)
    })
     */

})();

