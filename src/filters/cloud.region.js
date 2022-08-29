import CloudRegionType from '@/components/opscloud/common/enums/cloud.region.type'

export function getAWSRegionTypeText (envName) {
  if (CloudRegionType.AWS.regionType.find(e => e.label === envName)) {
    return CloudRegionType.AWS.regionType.find(e => e.label === envName).desc
  }
  return envName
}

export function getAliyunRegionTypeText (envName) {
  return CloudRegionType.ALIYUN.regionType.find(e => e.label === envName).desc
}
