module.exports = {
  /** koa运行端口 */
  port: 3000,

  /** 跨域放行域名 */
  // origin: [
  //   // /^https?:\/\/(.*)\.example\.com$/, // 允许example.com所有的子域名跨域
  //   // /^https?:\/\/example\.com$/, // 允许example.com跨域
  //   /^https?:\/\/127\.0\.0\.1$/, // 允许https://127.0.0.1和http://127.0.0.1跨域
  //   /^https?:\/\/127\.0\.0\.1:(\d+)$/, //允许127.0.0.1所有的端口跨域
  //   /^https?:\/\/localhost$/, //允许localhost跨域
  //   /^https?:\/\/localhost:(\d+)$/,
  //   /^https?:\/\/(.*)\.kongxiangyiren\.top$/,
  //   /^https?:\/\/kongxiangyiren\.top$/
  // ],

  /** false 允许所有域名跨域 */
  origin: false,

  // 经过防盗链的后缀名, referer 为 false 无效
  suffix: /\.(js|css|jpe?g|gif|png|webp)(\?.*)?$/i,
  /** 防盗链允许域名 */
  // referer: [
  //   // /^https?:\/\/(.*)\.example\.com$/, // 允许example.com所有的子域名
  //   // /^https?:\/\/example\.com$/, // 允许example.com
  //   /^https?:\/\/127\.0\.0\.1$/, // 允许https://127.0.0.1和http://127.0.0.1
  //   /^https?:\/\/127\.0\.0\.1:(\d+)$/, //允许127.0.0.1所有的端口
  //   /^https?:\/\/localhost$/, //允许localhost跨域
  //   /^https?:\/\/localhost:(\d+)$/,
  //   /^https?:\/\/(.*)\.kongxiangyiren\.top$/,
  //   /^https?:\/\/kongxiangyiren\.top$/
  // ],

  /** false 不设置防盗链 */
  referer: false,
  // githubcalendar 缓存 , 默认10分钟
  githubcalendar: 1000 * 60 * 10 //缓存时间(ms)
};
