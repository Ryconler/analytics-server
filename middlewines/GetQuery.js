const recordModel=require('../models/Record')

module.exports=async (ctx,next)=>{
    await next()
    /*
    if(ctx.path==='/resources/images/wa.gif'){
        // console.log(ctx.query);
        // console.log(ctx.host);
        // console.log(ctx.hostname);
        // console.log(ctx.ip);
        const query=ctx.query
        const record={
            w_identification:'xx',
            ip:ctx.ip,
            url:query.url,
            referrer:query.referrer,
            os:query.platform,
            browser:query.userAgent
        }
       recordModel.createRecord(record)

    }
    if(ctx.path==='/resources/images/close.gif'){
        // console.log(ctx.query);
        // console.log(ctx.host);
        // console.log(ctx.hostname);
        // console.log(ctx.ip);
        recordModel.addCloseTime(1);
    }

*/
}
