module.exports = async (ctx, next) =>{
    try {
        await next()
    }
    catch (e) {
        console.log('Error:',e.message);
        ctx.status = 500
        ctx.body = {
            status: 5,
            message: e.message
        }
    }
}
