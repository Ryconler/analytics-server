(function () {
    const server = 'http://analytics.server.jessezhu.cn'
    // const server = 'http://127.0.0.1:4000'

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

    const params = {};
    const dateNow = Date.now()
    const image = new Image(1,1)
    /* 网站标识 */
    window.waData.forEach(function (item) {
        if (item[0] === 'config') {
            params.config = item[1];
        }
    })
    const key = 'wa_' + params.config

    const waOpen = localStorage.getItem(key) || ''  // 型如：1586592534516,1586592534516  最近一次打开，第一次打开
    const latestTime = parseInt(waOpen.split(',')[0]) || 0
    const firstOpen = (dateNow - latestTime) > 1000 * 60 * 10  // 两次打开间隔小于10min仍属于同一次打开
    const firstTime = firstOpen ? dateNow : waOpen.split(',')[1]
    localStorage.setItem(key, dateNow + ',' +  firstTime)  // 更新wa_open
    params.url = document.URL
    params.openTime = firstTime
    if (firstOpen) {  // 第一次打开
        params.first = 1
        params.referrer = document.referrer
        params.host = window.location.host
        params.width = window.screen.width || '';  //显示器屏幕宽度
        params.height = window.screen.height || '';  //显示器屏幕高度
        params.colorDepth = window.screen.colorDepth || '';// 颜色深度
        params.appName = navigator.appName
        getAddress(function (data) {
            params.ip = data[0]
            params.address = data[1]
            params.service = data[2]
            image.src = server + '/resources/images/wa.gif?' + params2string(params);
        })
    }else {  // 不是第一次打开
        params.first = 0
        image.src = server + '/resources/images/wa.gif?' + params2string(params);
    }


    /* 关闭页面再发送一次关闭请求 */
    window.onbeforeunload = function (){
        const closeParams = {
            openTime: firstTime,
            config: params.config,
            closeTime: Date.now()
        }
        image.src = server + '/resources/images/wa.gif?' + params2string(closeParams);
    }

})();

