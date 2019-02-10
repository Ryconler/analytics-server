class TestController{
    async getJson(ctx){
        ctx.body = {
            title: 'koa2 jsons'
        }
    }
}

module.exports=new TestController()
