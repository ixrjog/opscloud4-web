<template>
  <div class="d2-page-cover">
<!--    <div class="d2-page-cover__logo">-->
<!--      <slot/>-->
<!--    </div>-->
    <slot/>
<!--    <p class="d2-page-cover__title">Opscloud {{$version}}</p>-->
    <p class="d2-page-cover__title">Version 4.2.0</p>
    <p class="d2-page-cover__sub-title">IaC 基础架构即代码</p>
    <p class="d2-page-cover__build-time">FINAL BUILD TIME {{$buildTime}}</p>
    <slot name="footer"/>
    <a target="blank" href="https://github.com/ixrjog/opscloud4">
      <img
        style="position: absolute; top: 0; right: 0; border: 0; width: 150px;"
        src="./image/darkblue@2x.png"
        alt="Fork me on GitHub">
    </a>
  </div>
</template>

<style lang="scss" scoped>
.d2-page-cover {
  @extend %full;
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__logo {
    img {
      width: 200px;
    }
  }
  .d2-page-cover__title {
    margin: 0px;
    margin-bottom: 20px;
    font-weight: bold;
    color: $color-text-main;
  }
  .d2-page-cover__sub-title {
    margin: 0px;
    margin-bottom: 5px;
    color: $color-text-normal;
  }
  .d2-page-cover__build-time {
    margin: 0px;
    margin-bottom: 10px;
    font-size: 12px;
    color: $color-text-placehoder;
  }
}
</style>
