(function () {

    let params = {};
    //客户的网站标识
    if(_wa) {
        for(let i in _wa) {
            if((_wa[i][0])==='_setAccount')
                params.account = _wa[i][1];
        }
    }

    params.openTime=Date.now()
    //Document对象数据
    if (document) {
        params.domain = document.domain || '';
        params.url = document.URL || '';
        params.referrer = document.referrer || '';  //上一页url
    }
    //Window对象
    if (window && window.screen) {
        params.width = window.screen.width || 0;  //显示器屏幕宽度
        params.height = window.screen.height || 0;  //显示器屏幕高度
        params.colorDepth=window.screen.colorDepth || 0  ;// 颜色深度
    }
    //Navigator浏览器对象
    if (navigator) {
        params.userAgent=navigator.userAgent||'';  //客户机发送服务器的 user-agent 头部的值
        params.appName=navigator.appName
        params.appVersion=navigator.appVersion
    }

    //通过Image对象请求后端脚本,实现跨域请求自己的服务器
    window.onbeforeunload= ()=>{
        params.closeTime=Date.now()
        //拼接params
        let args = '';
        for (let p in params) {
            if (args !== '') {  //最后一个参数后不用加&
                args += '&';
            }
            args += p + '=' + encodeURIComponent(params[p]);  //encodeURIComponent:编码URL带参数
        }
        let img = new Image(1, 1);
        img.src = 'http://127.0.0.1:4000/resources/images/wa.gif?'+args;
    }
    // console.log(params);
})();

