<template>
  <div class="meta-cardInfo">
    <div v-for="assetDetail in assetDetails" :key="assetDetail.assetType">
      <p>
        <d2-count-up :end="assetDetail.assetSize"/>
      </p>
      <p>
        <span>{{ assetDetail.assetType | getAssetTypeText }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { getAssetTypeText } from '@/filters/asset.type'

export default {
  name: 'DsAssetTypes',
  props: ['assetDetails'],
  filters: {
    getAssetTypeText
  }
}
</script>

<style lang="less" scoped>
.meta-cardInfo {
  display: flex;
  flex-wrap: wrap;
  height: 120px;
  overflow: auto;

  > div {
    margin-bottom: 4px;
    flex-grow: 1;
    flex-basis: 25%;

    p {
      line-height: 32px;
      font-size: 12px;
      font-weight: bolder;
      margin: 0;
      color: #B7B6B6;

      &:first-child {
        color: #20A9D9;
        font-size: 24px;
        font-weight: lighter;
        line-height: 20px;
        margin-bottom: 4px;
      }
    }

  }
}
</style>
