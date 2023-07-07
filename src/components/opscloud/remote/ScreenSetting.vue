<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-form :model="screenSetting">
      <el-form-item label="屏幕分辨率" :label-width="labelWidth">
        <el-select v-model="screenSetting.screenResolution" size="mini" placeholder="选择类型" @change="handleSetting">
          <el-option v-for="item in screenResolutionOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="屏幕DPI" :label-width="labelWidth">
        <el-select v-model="screenSetting.screenDpi" size="mini" placeholder="选择类型">
          <el-option v-for="item in screenDpiOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

const screenResolutionOptions = [{
  value: '1280x640',
  label: '1280x640'
}, {
  value: '1024x640',
  label: '1024x640'
}, {
  value: '800x600',
  label: '800x600'
}]

const screenDpiOptions = [{
  value: 128,
  label: '128'
}, {
  value: 96,
  label: '96'
}, {
  value: 64,
  label: '64'
}]

export default {
  name: 'ScreenSetting',
  props: [],
  data () {
    return {
      screenSetting: {
        screenResolution: '1280x640',
        screenDpi: 96
      },
      screenResolutionOptions: screenResolutionOptions,
      screenDpiOptions: screenDpiOptions,
      labelWidth: '150px'
    }
  },
  methods: {
    handleSetting () {
      this.$emit('handleSetting', this.screenSetting)
    }
  }
}
</script>

<style scoped>

</style>
