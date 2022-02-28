<template>
  <div>
    <span style="margin-right: 5px">可注入变量:</span>
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

/**
 *
 USERNAME_WITH_PASSWORD(1,"Username with password"),
 SSH_USERNAME_WITH_PRIVATE_KEY(2,"SSH Username with private key"),
 SSH_USERNAME_WITH_KEY_PAIR(3,"SSH Username with key pair"),
 TOKEN(4,"Token"),
 ACCESS_KEY(5,"Access key"),
 KUBE_CONFIG(6,"Kubernetes kubeconfig"), // Kubernetes Config 客户端配置文件
 *
 */

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
