<template>
  <el-card shadow="hover">
    <div slot="header" style="height: 15px">
      <span>菜单目录</span>
      <el-row style="float: right">
        <el-button @click="addMenu()" type="text" style="padding: 3px 0;margin-left: 5px;">新增</el-button>
        <el-button @click="saveMenu()" type="text" style="padding: 3px 0; margin-left: 5px;">保存</el-button>
      </el-row>
    </div>
    <draggable :list="menuList" @start="dragging = true" @end="dragging = false" :disabled="false">
      <div v-for="(menu,index) in menuList" :key="index">
        <el-form :inline="true" :model="menu" label-width="60px">
          <el-form-item label="名称" required>
            <el-input v-model.trim="menu.title"></el-input>
          </el-form-item>
          <el-form-item label="图标" required>
            <el-input v-model.trim="menu.icon"
                      :suffix-icon="getIcon(menu.icon)"></el-input>
          </el-form-item>
          <span style="float: right">
            <el-form-item>
              <el-button :disabled="menu.id === ''" @click="handlerMenuChild(menu)" plain>子菜单</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" plain @click.prevent="handlerDel(menu)">删除</el-button>
            </el-form-item>
          </span>
        </el-form>
      </div>
    </draggable>
  </el-card>
</template>

<script>
import draggable from 'vuedraggable'
import { DELETE_MENU, QUERY_MENU, SAVE_MENU } from '@/api/modules/sys/sys.menu'

const menu = {
  id: '',
  title: '',
  icon: ''
}

export default {
  data () {
    return {
      menuList: [],
      dragging: false
    }
  },
  name: 'MenuCard',
  mounted () {
    this.fetchData()
  },
  components: {
    draggable
  },
  methods: {
    addMenu () {
      this.menuList.push(Object.assign({}, menu))
    },
    saveMenu () {
      const param = {
        menuList: this.menuList
      }
      SAVE_MENU(param)
        .then(() => {
          this.$message.success('保存菜单成功')
          this.fetchData()
        })
    },
    handlerMenuChild (menu) {
      this.$emit('handlerMenuChild', menu.id, menu.title)
    },
    getIcon (icon) {
      return `fa fa-${icon}`
    },
    handlerDel (menu) {
      if (menu.id === '') {
        const index = this.menuList.indexOf(menu)
        if (index !== -1) {
          this.menuList.splice(index, 1)
        }
      } else {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DELETE_MENU({id: menu.id})
            .then(() => {
              this.fetchData()
              this.$message.success('删除成功!')
            })
        }).catch(() => {
          this.$message.info('已取消删除!')
        })
      }
    },
    fetchData () {
      QUERY_MENU()
        .then(({ body }) => {
          this.menuList = body
        })
    }
  }
}
</script>

<style>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
