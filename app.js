// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const   Koa = require('koa') ,
        http = require('http'), 
        path = require('path');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

//引入解析post body的middlewa
const bodyParser = require('koa-bodyparser');

//导入koa-router
const router = require('koa-router')();

//引入websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server : app});
// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    await next(); 
});
app.use(bodyParser());
app.use(router.routes());

router.get('/',async(ctx,next)=>{
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
})
router.post('/signin', async (ctx, next) => {
    console.log(ctx.request.body.name)
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

// 在端口3000监听:
app.listen(3000,'119.23.57.251');
console.log('app started at port 3000...');
