<!--suppress HtmlUnknownTag -->
<template>
  <div>
      <span class="name">
        {{ name }}
      </span>
      <span class="value">
        <slot>{{ value === undefined ? '-' : value }}</slot>
      </span>
  </div>
</template>

<script>

export default {
  name: 'LeoLabel',
  props: ['name', 'value']
}
</script>

<style scoped>

.name {
  color: #99a9bf;
  display: inline-block;
  width: 110px;
  font-size: 12px;
}

.value {
  display: inline-block;
  float: right;
  font-size: 12px;
}

</style>
