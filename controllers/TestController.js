class TestController{
    static async getJson(ctx){
        ctx.body = {
            title: 'get json',
            id:ctx.params.id
        }
    }
    static async postJson(ctx){
        ctx.body = {
            title: 'post json',
            body: ctx.request.body
        }
    }
}

module.exports=TestController
