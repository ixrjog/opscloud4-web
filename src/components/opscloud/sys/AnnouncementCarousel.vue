<template>
  <div v-if="JSON.stringify(announcements) !== '[]'" style="margin-bottom: 10px">
    <el-carousel trigger="click" height="150px" :interval="10000">
      <el-carousel-item v-for="announcement in announcements" :key="announcement.id">
        <h3 class="small">{{ announcement.title }}</h3>
        <p style="margin-left: 50px;font-size: 14px;" v-html="announcement.content"></p>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

import { GET_ANNOUNCEMENT } from '@/api/modules/sys/sys.announcement.api'

export default {
  name: 'AnnouncementCarousel',
  props: ['kind'],
  data () {
    return {
      announcements: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      GET_ANNOUNCEMENT({ kind: this.kind })
        .then(res => {
          this.announcements = res.body
        })
    }
  }
}
</script>

<style>

.el-carousel__item h3 {
  color: #475669;
  font-size: 15px;
  opacity: 0.75;
  line-height: 50px;
  margin: 0 0 0 50px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
