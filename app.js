const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const config = require('./config/config');
const nunjucks = require('nunjucks');
const LRU = require('lru-cache');

const index = require('./routes/index');
const githubcalendar = require('./routes/api/githubcalendar');

// error handler
onerror(app);

// middlewares
// 启用所有安全保护功能
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'], // 允许使用unpkg.com的cdn
        objectSrc: ["'none'"]
      }
    }, // 内容安全策略
    dnsPrefetchControl: true, // dns预读取控制
    expectCt: false, // ('Expect-CT '标头已弃用并将被删除。Chrome要求对2018年4月30日之后发布的所有公开受信任证书进行证书透明。) 证书透明度 (Certificate Transparency)，防止错误签发的网站证书的使用不被察觉
    frameguard: true,
    // frameguard: {
    //   action: 'sameorigin' // iframe设置同源
    // }, // iframe访问策略，预防点击劫持
    hidePoweredBy: true, // 隐藏`X-Powered-By`头信息
    hsts: true, // HTTP严格传输安全协议（HTTP Strict Transport Security）
    ieNoOpen: true, // IE8特有，强制保存潜在不安全的下载
    noSniff: false, // 禁止嗅探MIME类型
    permittedCrossDomainPolicies: true, // 访问源策略控制
    referrerPolicy: {
      policy: ['origin', 'unsafe-url']
    }, // 引用策略
    xssFilter: true // cross site script跨站脚本过滤
  })
);

// 跨域配置
app.use(
  cors({
    origin: function (ctx) {
      // 判断是否匹配
      const origin = config.origin
        ? config.origin.some(item => item.test(ctx.header.origin))
        : true;
      // 设置允许跨域url
      if (origin && ctx.url.slice(0, 4) === '/api') {
        return ctx.header.origin; // 允许来自所有域名请求
      }
    },
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: false, // 是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'] //设置服务器支持的所有头信息字段
    // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
);

// 开启gzip
app.use(
  compress({
    // filter(content_type) {
    //   return /text/i.test(content_type);
    // },
    threshold: 2048,
    // gzip: {
    //   flush: require('zlib').constants.Z_SYNC_FLUSH
    // },
    // deflate: {
    //   flush: require('zlib').constants.Z_SYNC_FLUSH
    // },
    br: false // disable brotli
  })
);

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
app.use(logger((str, args) => console.log(str)));
// 静态文件
app.use(
  require('koa-static')(__dirname + '/public', {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 缓存1天
    gzip: true,
    setHeaders: (res, filePath, stats) => {
      if (!config.referer) {
        // 放行
        return;
      }
      const suffix = filePath.substring(filePath.lastIndexOf('.'), filePath.length);
      if (!new RegExp(config.suffix).test(suffix)) {
        // 放行
        return;
      }
      // 设置防盗
      let referer = res.req.headers.referer;
      const fe = nunjucks.render(__dirname + '/views/error/403.html');
      // 找不到说明是直接打开
      if (!referer) {
        // 静态文件错误需要单独设置
        res.writeHead(403, {
          'Content-Length': Buffer.byteLength(fe),
          'Content-Type': 'text/html; charset=utf-8'
        });
        return res.end(fe);
      }
      let n = referer.indexOf('/', referer.indexOf('/') + 1);
      let n2 = referer.indexOf('/', n + 1);
      referer = referer.substring(0, n2);
      // 判断是否匹配
      const guard = config.referer.some(item => new RegExp(item).test(referer));
      if (!guard) {
        // 静态文件错误需要单独设置
        res.writeHead(403, {
          'Content-Length': Buffer.byteLength(fe),
          'Content-Type': 'text/html; charset=utf-8'
        });
        return res.end(fe);
      }
    }
  })
);

// 权限处理
app.use(async (ctx, next) => {
  await next();
  // 设置 返回状态
  ctx.status = ctx.status;
  // 设置错误模板
  switch (parseInt(ctx.status)) {
    case 404:
      await ctx.render('error/404');
      break;
    case 403:
      await ctx.render('error/403');
      break;
  }
});

// 模板
app.use(views(__dirname + '/views', { map: { html: 'nunjucks' }, extension: 'html' }));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// cache
global.cacheLRU = new LRU({
  max: 500, // 缓存中保留的最大项数
  ttl: 1000 * 60 * 10 // 最大缓存时间(ms)
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(githubcalendar.routes(), githubcalendar.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
