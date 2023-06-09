<!--suppress HtmlUnknownTag -->
<template>
  <div style="display: flex">
    <h1>{{ datasourceNane }}</h1>
    <h4 v-if="instance.name !== null">{{ instance.name }}</h4>
  </div>
</template>

<script>
import { QUERY_DATASOURCE_INSTANCE_BY_ID } from '@/api/modules/datasource/datasource.instance.api'

export default {
  data () {
    return {
      instance: {
        name: null
      }
    }
  },
  name: 'DatasourceInstanceTitle',
  props: {
    datasourceNane: {
      type: String,
      required: true
    },
    instanceId: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      QUERY_DATASOURCE_INSTANCE_BY_ID({ instanceId: this.instanceId }).then(({ body }) => {
        this.instance.name = body.instanceName
      })
    }
  }
}
</script>

<style lang="less" scoped>
h4 {
  margin: 20px 10px 0;
  color: #B7B6B6;
  padding: 20px 0 0;
}
</style>
