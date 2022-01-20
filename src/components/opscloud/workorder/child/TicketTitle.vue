<template>
  <div>
    <span>#{{ id }}</span>
    <span style="margin-left: 5px">{{ title }}工单</span>
  </div>
</template>

<script>
export default {
  name: 'TicketTitle',
  props: {
    id: {
      type: Number,
      required: false,
      default: () => 0
    },
    title: {
      type: String,
      required: false,
      default: () => ''
    }
  }
}
</script>

<style scoped>

</style>
