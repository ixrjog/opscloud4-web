import CloudRegionType from '@/components/opscloud/common/enums/cloud.region.type'

export function getAWSRegionTypeText (regionId) {
  return CloudRegionType.AWS.regionType.find(e => e.value === regionId).desc
}

export function getAliyunRegionTypeText (regionId) {
  return CloudRegionType.ALIYUN.regionType.find(e => e.value === regionId).desc
}
