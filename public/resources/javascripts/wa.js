(function () {
    let params = {};

    params.openTime=Date.now()

    //Document对象数据
    if (document) {
        params.title = document.title || '';
        params.domain = document.domain || '';
        params.url = document.URL || '';
        params.referrer = document.referrer || '';  //上一页url
        /*
        console.log("标题:", document.title);
        console.log("域名:", document.domain);
        console.log("当前url:", document.URL);
        console.log("上一页url:", document.referrer);
        */
    }

    //Window对象
    if (window && window.screen) {
        params.width = window.screen.width || 0;  //显示器屏幕宽度
        params.height = window.screen.height || 0;  //显示器屏幕高度
        params.outerWidth = window.outerWidth || 0;  //窗口宽度
        params.outerHeight = window.outerHeight || 0;  //窗口高度
        params.innerWidth = window.innerWidth || 0;  //窗口内文档宽度
        params.innerHeight = window.innerHeight || 0;  //窗口内文档高度
        /*
        console.log("显示器屏幕宽度:",window.screen.width);
        console.log("显示器屏幕高度:",window.screen.height);
        console.log("窗口宽度:",window.outerWidth);
        console.log("窗口高度:",window.outerHeight);
        console.log("窗口内文档宽度:",window.innerWidth);
        console.log("窗口内文档高度:",window.innerHeight);
        */
    }

    //Navigator浏览器对象
    if (navigator) {
        params.appCodeName = navigator.appCodeName || '';  //浏览器代码名
        params.language = navigator.language || '';  //浏览器的语言
        params.platform=navigator.platform||'';  //操作系统
        params.userAgent=navigator.userAgent||'';  //客户机发送服务器的 user-agent 头部的值
        /*
        console.log("浏览器代码名:",navigator.appCodeName);
        console.log("浏览器的语言:",navigator.language);
        */
    }

    //客户的网站标识
    if (_wa) {
        for (let i in _wa) {
            if (_wa[i][0] === '_setAccount') {
                params.account = _wa[i][1];
            }
        }
    }

    // console.log(params);

    //拼接params
    let args = '';
    for (let p in params) {
        if (args !== '') {  //最后一个参数后不用加&
            args += '&';
        }
        args += p + '=' + encodeURIComponent(params[p]);  //encodeURIComponent:编码URL带参数

    }

    //通过Image对象请求后端脚本,实现跨域请求自己的服务器
    let img = new Image(1, 1);
    img.src = 'http://127.0.0.1:4000/resources/images/wa.gif?' + args;

    window.onbeforeunload= (e)=>{
        const closeTime=Date.now()
        let i = new Image(1, 1);
        i.src = 'http://127.0.0.1:4000/resources/images/close.gif?closeTime='+closeTime;
    }
})();

