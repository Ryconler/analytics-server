class TestController{
    async getJson(ctx){
        console.log(ctx.params);
        ctx.body = {
            title: 'koa2 jsons'
        }
    }
}

module.exports=new TestController()
