<!--suppress HtmlUnknownTag -->
<template>
  <el-tag type="success">
    <div class="envoyLogo">
      <img class="envoyLogoImg" src="@/static/Envoy_Logo_Final_CMYK.png" alt="">
    </div>
  </el-tag>
</template>

<script>

export default {
  name: 'EnvoyLogo'
}
</script>

<style>

.envoyLogo {
  text-align: center;
}

.envoyLogoImg {
  display: inline-block;
  vertical-align: middle;
  height: 17px;
  margin-top: -4px;
}

</style>
