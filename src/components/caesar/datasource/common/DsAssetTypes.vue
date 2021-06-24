<template>
  <div class="meta-cardInfo">
    <div v-for="assetDetail in assetDetails" :key="assetDetail.assetType" ref="div">
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

  > div {
    text-align: left;
    float: left;
    width: 33%;
    margin-bottom: 4px;

    p {
      line-height: 32px;
      font-size: 12px;
      font-weight: 300;
      margin: 0;
      color: #B7B6B6;

      &:first-child {
        color: #20A9D9;
        font-size: 24px;
        line-height: 20px;
        margin-bottom: 4px;
      }
    }

  }
}
</style>
