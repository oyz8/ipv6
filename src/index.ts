import { Hono } from 'hono'
import { updateOriginGroupIPv6, OriginUpdateParams } from './cloud/tencent'

export const app = new Hono()

// webhook 接口
app.post('/api/update_origin_ipv6', async (c) => {
  const body: any = await c.req.json()
  const { secret_id, secret_key, origins } = body

  if (!secret_id || !secret_key || !Array.isArray(origins) || origins.length === 0) {
    return c.json({ status: 'fail', message: '参数缺失或 origins 为空' }, 400)
  }

  const results: Array<any> = []

  for (let i = 0; i < origins.length; i++) {
    const origin = origins[i]
    const { zone_id, origin_group_id, ipv6 } = origin

    if (!zone_id || !origin_group_id || !ipv6) {
      results.push({ zone_id, origin_group_id, status: 'fail', message: '参数缺失' })
      continue
    }

    try {
      const res = await updateOriginGroupIPv6({
        secretId: secret_id,
        secretKey: secret_key,
        zoneId: zone_id,
        originGroupId: origin_group_id,
        ipv6
      })
      results.push({ zone_id, origin_group_id, status: res.flag ? 'ok' : 'fail', message: res.message })
    } catch (err: any) {
      results.push({ zone_id, origin_group_id, status: 'fail', message: err.message || '更新失败' })
    }

    // 每个源站组间隔 3 秒
    if (i < origins.length - 1) await new Promise(r => setTimeout(r, 3000))
  }

  return c.json({ status: 'ok', results })
})

export default app
