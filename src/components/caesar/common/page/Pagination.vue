<template>
  <el-pagination background @current-change="paginationCurrentChange" :page-sizes="pageSizes"
                 @size-change="handleSizeChange"
                 layout="sizes, prev, pager, next" :total="pagination.total"
                 :current-page="pagination.currentPage"
                 :page-size="pageSize">
  </el-pagination>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Pagination',
  props: ['pagination'],
  data () {
    return {
      pageSizes: [10, 15, 20, 30, 50],
      pageSize: 10 // default
    }
  },
  mounted () {
    this.initPageSize()
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions({
      setPageSize: 'd2admin/user/set'
    }),
    initPageSize () {
      if (typeof (this.info.pageSize) !== 'undefined') {
        this.pageSize = this.info.pageSize
      }
    },
    handleSizeChange (size) {
      this.info.pageSize = size
      this.setPageSize(this.info)
      this.$emit('handleSizeChange', size)
    },
    paginationCurrentChange (args) {
      this.$emit('paginationCurrentChange', args)
    }
  }
}

</script>

<style scoped>

</style>
