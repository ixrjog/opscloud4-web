<template>
  <!--  class="page"-->
  <d2-container class="page">
    <div align="center">
      <logo2></logo2>
      <echarts-font v-if="false" text="OPSCLOUD" :font-size="50"></echarts-font>
      <a target="blank" href="https://github.com/ixrjog/opscloud4">
        <img
          style="position: absolute; top: 0; right: 0; border: 0; width: 120px;"
          src="./image/darkblue@2x.png"
          alt="Fork me on GitHub">
      </a>
    </div>
    <!--    <el-row>-->
    <!--      <el-col :span="16" :offset="4">-->
    <!--        <el-row :gutter="10" class="nav-card">-->
    <!--          <el-col :span="4" v-for="nav in navList" :key="nav.id">-->
    <!--            <el-card shadow="hover" @click.native=openNavUrl(nav)>-->
    <!--              <p>{{ nav.navTitle }}</p>-->
    <!--              <p>{{ nav.navContent }}</p>-->
    <!--            </el-card>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <document-zone mount-zone="HOME"></document-zone>
    <!--    logo-->
    <!--      <div class="d2-page-cover__logo">-->
    <!--        <d2-icon-svg class="logo" name="d2-admin"/>-->
    <!--      </div>-->
    <template slot="footer">
      <div class="btn-group">
        <div align="center">
          <p class="d2-page-cover__title">Version {{ version }}</p>
          <p class="d2-page-cover__build-time">FINAL BUILD TIME {{ $buildTime }}</p>
        </div>
        <!--                  <span class="btn-group__btn" @click="$open('https://github.com/d2-projects')">开源组织</span> |-->
        <!--          <span class="btn-group__btn" @click="$open('https://d2.pub/zh/doc/d2-admin')">文档</span> |-->
        <!--          <span class="btn-group__btn" @click="$open('https://github.com/d2-projects/d2-admin-start-kit')">简化版</span> |-->
        <!--          <span class="btn-group__btn" @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">掘金</span> |-->
        <!--          <el-popover :width="150" trigger="hover">-->
        <!--            <img src="./image/qr.jpg" style="width: 150px;">-->
        <!--            <span slot="reference" class="btn-group__btn btn-group__btn&#45;&#45;link">-->
        <!--              <d2-icon name="weixin"/>-->
        <!--              微信服务号-->
        <!--            </span>-->
        <!--          </el-popover>-->
      </div>
      <d2-badge/>
      <d2-help/>
    </template>
    <!--    </d2-page-cover>-->
  </d2-container>
</template>

<script>

import D2Badge from './components/d2-badge'
import D2Help from './components/d2-help'
import EchartsFont from '@/components/opscloud/common/EchartsFont'
import 'animate.css'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'
import Logo2 from '@/components/opscloud/common/Logo2'

export default {
  data () {
    return {
      fontStyle: '',
      navList: [],
      /**
       * OPSCLOUD前端版本号
       */
      version:  process.env.VUE_APP_OC_VERSION
    }
  },
  components: {
    D2Badge,
    D2Help,
    EchartsFont,
    DocumentZone,
    // eslint-disable-next-line no-undef
    Logo2
  },
  mounted () {
    console.log(process.env)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }

  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;

    .btn-group__btn {
      color: $color-text-sub;

      &:hover {
        color: $color-text-main;
      }

      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.nav-card {

  .el-card {
    /deep/ .el-card__body {
      padding: 0;
    }

    border-radius: 25px;
    border: 2px solid #EBEEF5;
    padding: 10px;
    width: 140px;
    height: 50px;
    margin-bottom: 5px;
    margin-top: 10px;
    overflow: hidden;

    p {
      margin: 5px 0;
      font-size: 12px;
      color: #B7B6B6;
      text-align: center;

      &:first-child {
        color: #20A9D9;
        font-size: 16px;
        line-height: 20px;

        &:hover {
          animation: heartBeat; /* referring directly to the animation's @keyframe declaration */
          animation-duration: 2s; /* don't forget to set a duration! */
        }
      }
    }
  }
}
</style>
