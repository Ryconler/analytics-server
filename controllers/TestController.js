class TestController{
    static async getJson(ctx){
        ctx.body = {
            status: 2,
            title: 'get json',
            id:ctx.params.id
        }
    }
    static async postJson(ctx){
        ctx.body = {
            status: 2,
            title: 'post json',
            body: ctx.request.body
        }
    }
}

module.exports=TestController
