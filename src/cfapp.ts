import { serveStatic } from 'hono/cloudflare-workers' // @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'
import * as index from './index'
import { Context } from "hono"

// 根路径重定向到 index.html
index.app.use('/', async (c: Context) => {
  return c.redirect("/index.html")
})

// 其他未匹配路径，直接返回静态资源
index.app.use("*", serveStatic({ manifest: manifest, root: "./" }))

export default index.app
