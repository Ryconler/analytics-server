module.exports=async (ctx,next)=>{
    if(ctx.path==='/resources/images/wa.gif'){
        console.log(ctx.query);
        console.log(ctx.host);
        console.log(ctx.hostname);
        console.log(ctx.ip);
    }
    if(ctx.path==='/resources/images/close.gif'){
        console.log(ctx.query);
        console.log(ctx.host);
        console.log(ctx.hostname);
        console.log(ctx.ip);
    }
    await next()
}
