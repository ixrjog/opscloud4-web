<template>
  <el-card shadow="never">
    <div slot="header" style="height: 15px">
      <span>菜单目录</span>
      <el-row style="float: right">
        <el-button type="success" icon="el-icon-lock" v-if="finalized" plain
                   @click="updateFinalized()" size="mini"></el-button>
        <el-button type="warning" icon="el-icon-unlock" v-if="!finalized" plain
                   @click="updateFinalized()" size="mini"></el-button>
        <el-button-group style="margin-left: 10px">
          <el-button plain @click="addMenu()" size="mini" :disabled="finalized">新增</el-button>
          <el-button plain @click="saveMenu()" size="mini" :disabled="finalized">保存</el-button>
        </el-button-group>
      </el-row>
    </div>
    <draggable :list="menuList" @start="dragging = true" @end="dragging = false" :disabled="finalized">
      <div v-for="(menu,index) in menuList" :key="index">
        <el-form :inline="true" :model="menu" label-width="60px">
          <el-form-item label="名称" required>
            <el-input v-model.trim="menu.title" :readonly="finalized"></el-input>
          </el-form-item>
          <el-form-item label="图标" required>
            <el-input v-model.trim="menu.icon" :readonly="finalized"
                      :suffix-icon="getIcon(menu.icon)"></el-input>
          </el-form-item>
          <span style="float: right">
            <el-form-item>
              <el-button :disabled="menu.id === ''" @click="handlerMenuChild(menu)" plain>子菜单</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" plain @click.prevent="handlerDel(menu)" :disabled="finalized">删除</el-button>
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
      finalized: true,
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
    updateFinalized () {
      this.finalized = !this.finalized
    },
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
          DELETE_MENU(menu.id)
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
