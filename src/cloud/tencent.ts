import * as teo from "tencentcloud-sdk-nodejs-teo";

const TeoClient: any = teo.teo.v20220901.Client;

export interface OriginUpdateParams {
  secretId: string;
  secretKey: string;
  zoneId: string;
  originGroupId: string;
  ipv6: string;
}

/**
 * 更新腾讯云 EdgeOne 源站组的 IPv6
 */
export async function updateOriginGroupIPv6(params: OriginUpdateParams): Promise<{ flag: boolean; message: string }> {
  const { secretId, secretKey, zoneId, originGroupId, ipv6 } = params;

  if (!secretId || !secretKey || !zoneId || !originGroupId || !ipv6) {
    return { flag: false, message: "参数缺失" };
  }

  const client = new TeoClient({
    credential: { secretId, secretKey },
    region: "",
    profile: { httpProfile: { endpoint: "teo.tencentcloudapi.com" } },
  });

  try {
    await client.ModifyOriginGroup({
      ZoneId: zoneId,
      GroupId: originGroupId,
      Records: [{ Record: ipv6, Type: "IP_DOMAIN", Weight: 100 }]
    });
    return { flag: true, message: `源站组已更新为 ${ipv6}` };
  } catch (err: any) {
    return { flag: false, message: err.message || "更新失败" };
  }
}
