<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <div style="margin-right: 5px; color: white">Available environment variables</div>
    <span v-if="kind === 1" v-for="tag in examples.USERNAME_WITH_PASSWORD" :key="tag.name" style="color: #d9d9d9">
      {{ tag.name }}
    </span>
    <span v-if="kind === 4" v-for="tag in examples.TOKEN" :key="tag.name" style="color: #d9d9d9">
      {{ tag.name }}
    </span>
    <span v-if="kind === 5" v-for="tag in examples.ACCESS_KEY" :key="tag.name" style="color: #d9d9d9">
      {{ tag.name }}
    </span>
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
