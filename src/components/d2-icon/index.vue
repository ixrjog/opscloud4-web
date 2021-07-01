<template>
  <i :class="name" aria-hidden="true"></i>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.min.css'
// import './font-awesome-4.7.0/css/font-awesome.min.css'
export default {
  name: 'd2-icon',
  props: {
    name: {
      type: String,
      required: false,
      default: 'fab fa-font-awesome'
    }
  }
}
</script>
