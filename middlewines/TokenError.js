module.exports = async (ctx, next) => {
    return next().catch(err => {
        if (err.status === 401) {
            ctx.status = 200
            ctx.body = {
                status: 4,
                message: err.originalError ? err.originalError.message : err.message
            }
        } else throw err
    })
}
