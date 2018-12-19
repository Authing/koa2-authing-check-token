module.exports = () => {
    return async (ctx, next) => {
        if (!ctx.request.authing) {
            throw new Error('ctx.request.authing 不存在，此中间件需结合 koa2-authing 使用');
        }
        let token = ctx.request.body.token || ctx.request.query.token || ctx.request.header.token;
        if(!token) {
            ctx.status = 401;
            ctx.body = {errno: 2401, msg: 'token 不能为空', data: null};
            return
        }
        try {
            let result = await ctx.request.authing.checkLoginStatus(token);
            if(result.status === true) {
                try {
                    await next();
                } catch (e) {
                    console.log(e)
                }
            } else {
                ctx.status = 401;
                ctx.body = {errno: 2402, msg: result.message, code: result.code, data: null};
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
            ctx.body = {errno: 2403, msg: 'Authing checkLoginStatus 服务失败', data: null};
        }
    };
};
