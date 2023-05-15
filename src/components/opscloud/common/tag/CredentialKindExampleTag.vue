<template>
  <div>
    <div style="margin-right: 5px">可注入变量:</div>
    <el-tag v-if="kind === 1" size="mini" :type="tag.type" style="margin-right: 5px"
            v-for="tag in examples.USERNAME_WITH_PASSWORD" :key="tag.name">
      {{ tag.name }}
    </el-tag>
    <el-tag v-if="kind === 4" size="mini" :type="tag.type" style="margin-right: 5px"
            v-for="tag in examples.TOKEN" :key="tag.name">
      {{ tag.name }}
    </el-tag>
    <el-tag v-if="kind === 5" size="mini" :type="tag.type" style="margin-right: 5px"
            v-for="tag in examples.ACCESS_KEY" :key="tag.name">
      {{ tag.name }}
    </el-tag>
  </div>
</template>

<script>

export default {
  name: 'CredentialKindExampleTag',
  props: ['kind'],
  data () {
    return {
      examples: {
        USERNAME_WITH_PASSWORD: [
          { name: '${credentialUsername}', type: 'warning' },
          { name: '${credentialPassword}', type: 'danger' }
        ],
        TOKEN: [
          { name: '${credentialToken}', type: 'danger' }
        ],
        ACCESS_KEY: [
          { name: '${credentialAccessKey}', type: 'warning' },
          { name: '${credentialSecret}', type: 'danger' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {}
}
</script>

<style scoped>

</style>
