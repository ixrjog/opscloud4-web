<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <span>No.{{ id }}</span>
    <span style="margin-left: 5px" v-if="$i18n.locale === 'zh-chs'">{{ workOrder.name }}</span>
    <span style="margin-left: 5px" v-if="$i18n.locale === 'en'">{{ workOrder.i18nEn }}</span>
  </div>
</template>

<script>
export default {
  name: 'TicketTitleI18n',
  props: {
    id: {
      type: Number,
      required: true,
      default: 0
    },
    workOrder: {
      type: Object,
      required: true,
      default: { name: 'null', i18nEn: 'null' }
    }
  }
}
</script>

<style scoped>

</style>
