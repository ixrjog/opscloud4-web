<template>
  <div>
    <el-row>
        <span v-for="assetDetail in assetDetails">
      <el-col :span="8">
         <div class="size">{{assetDetail.assetSize}}</div>
         <div class="type">{{assetDetail.assetType}}</div>
      </el-col>
    </span>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'DsAssetTypes',
  props: ['assetDetails']
}
</script>

<style scoped>
  .size {
    font-size: 20px;
    color:#20A9D9 ;
    font-weight: 300;
  }

  .type {
    font-size: 7px;
    color: #B7B6B6;
  }

</style>
