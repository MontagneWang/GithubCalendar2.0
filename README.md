# 不做修改

点击部署

[![部署](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/kongxiangyiren/vercel-githubcalendar)

访问 https://<你的域名>/api/githubcalendar/api?<你的 github 名称>

# 跨域、防盗、缓存

github 复刻项目后
具体请看 config/config.js

# hexo 配置

以 hexo-filter-gitcalendar 和 hexo-githubcalendar 为例

请修改例子中的 `<你的 calendar 域名>` 为你的 calendar 域名,`<你的github用户名>` 为你的 github 用户名

## hexo-filter-gitcalendar 配置

```yaml
# hexo-filter-gitcalendar
# see https://akilar.top/posts/1f9c68c9/
gitcalendar:
  enable: true # 开关
  priority: 5 #过滤器优先权
  enable_page: / # 应用页面
  # butterfly挂载容器
  layout: # 挂载容器类型
    type: id
    name: recent-posts
    index: 0
  # volantis挂载容器
  # layout:
  #   type: class
  #   name: l_main
  #   index: 0
  # matery挂载容器
  # layout:
  #   type: id
  #   name: indexCard
  #   index: 0
  # mengd挂载容器
  # layout:
  #   type: class
  #   name: content
  #   index: 0
  user: <你的github用户名> #git用户名
  apiurl: 'https://<你的 calendar 域名>/api/githubcalendar'
  jsonurl: #开发者专用
  minheight:
    pc: 280px #桌面端最小高度
    mibile: 0px #移动端最小高度
  color: "['#e4dfd7', '#f9f4dc', '#f7e8aa', '#f7e8aa', '#f8df72', '#fcd217', '#fcc515', '#f28e16', '#fb8b05', '#d85916', '#f43e06']" #橘黄色调
  # color: "['#ebedf0', '#fdcdec', '#fc9bd9', '#fa6ac5', '#f838b2', '#f5089f', '#c4067e', '#92055e', '#540336', '#48022f', '#30021f']" #浅紫色调
  # color: "['#ebedf0', '#f0fff4', '#dcffe4', '#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#165c26', '#144620']" #翠绿色调
  # color: "['#ebedf0', '#f1f8ff', '#dbedff', '#c8e1ff', '#79b8ff', '#2188ff', '#0366d6', '#005cc5', '#044289', '#032f62', '#05264c']" #天青色调
  container: .recent-post-item(style='width:100%;height:auto;padding:10px;') #父元素容器，需要使用pug语法
  gitcalendar_css: https://unpkg.zhimg.com/hexo-filter-gitcalendar/lib/gitcalendar.css
  gitcalendar_js: https://unpkg.zhimg.com/hexo-filter-gitcalendar/lib/gitcalendar.js
```

## hexo-githubcalendar 配置

```yaml
# github 提交统计
githubcalendar:
  enable: true
  enable_page: /
  user: <你的github用户名>
  layout:
    type: id
    name: recent-posts
    index: 0
  githubcalendar_html: '<div class="recent-post-item" style="width:100%;height:auto;padding:10px;"><div id="github_loading" style="width:10%;height:100%;margin:0 auto;display: block"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 50 50" style="enable-background:new 0 0 50 50" xml:space="preserve"><path fill="#d0d0d0" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" transform="rotate(275.098 25 25)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg></div><div id="github_container"></div></div>'
  pc_minheight: 280px
  mobile_minheight: 0px
  color: "['#ebedf0', '#f0fff4', '#dcffe4', '#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#165c26', '#144620']" #翠绿色调
  api: https://<你的 calendar 域名>/api/githubcalendar/api
  calendar_js: https://npm.elemecdn.com/hexo-githubcalendar@1.1.8/hexo_githubcalendar.js
  plus_style: ''
```
