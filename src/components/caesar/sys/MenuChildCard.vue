<template>
  <el-card shadow="never" v-show="menuId !== ''">
    <div slot="header" style="height: 15px">
      <span>{{ title }}</span>
      <el-row style="float: right">
        <el-button type="success" icon="el-icon-lock" v-if="finalized" plain
                   @click="updateFinalized()" size="mini"></el-button>
        <el-button type="warning" icon="el-icon-unlock" v-if="!finalized" plain
                   @click="updateFinalized()" size="mini"></el-button>
        <el-button-group style="margin-left: 10px">
          <el-button plain @click="addMenuChild()" size="mini" :disabled="finalized">新增</el-button>
          <el-button plain @click="saveMenuChild()" size="mini" :disabled="finalized">保存</el-button>
        </el-button-group>
      </el-row>
    </div>
    <draggable :list="menuChildList" @start="dragging = true" @end="dragging = false" :disabled="finalized">
      <div v-for="(menuChild,index) in menuChildList" :key="index">
        <el-form :inline="true" :model="menuChild" label-width="60px">
          <el-form-item label="名称" required>
            <el-input v-model.trim="menuChild.title" :readonly="finalized"></el-input>
          </el-form-item>
          <el-form-item label="路径" required>
            <el-input v-model.trim="menuChild.path" :readonly="finalized" class="input"></el-input>
          </el-form-item>
          <el-form-item label="图标" required>
            <el-input v-model.trim="menuChild.icon" :readonly="finalized"
                      :suffix-icon="getIcon(menuChild.icon)"></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="danger" plain @click.prevent="handlerDel(menuChild)" :disabled="finalized">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </draggable>
  </el-card>
</template>

<script>
import draggable from 'vuedraggable'
import { DELETE_MENU_CHILD, QUERY_MENU_CHILD, SAVE_MENU_CHILD } from '@/api/modules/sys/sys.menu.api'

const menuChild = {
  id: '',
  menuId: '',
  title: '',
  icon: '',
  path: ''
}

export default {
  data () {
    return {
      menuId: '',
      title: '',
      finalized: true,
      menuChildList: [],
      dragging: false
    }
  },
  name: 'MenuChildCard',
  mounted () {
  },
  components: {
    draggable
  },
  methods: {
    initData (menuId, title) {
      this.finalized = true
      this.menuId = menuId
      this.title = title
      this.fetchData()
    },
    updateFinalized () {
      this.finalized = !this.finalized
    },
    getIcon (icon) {
      return `fa fa-${icon}`
    },
    addMenuChild () {
      const data = Object.assign({}, menuChild)
      data.menuId = this.menuId
      this.menuChildList.push(data)
    },
    saveMenuChild () {
      const param = {
        menuChildList: this.menuChildList
      }
      SAVE_MENU_CHILD(param)
        .then(() => {
          this.$message.success('保存子菜单成功')
          this.fetchData()
        })
    },
    handlerSubmenu (menu) {
      this.$emit('handlerMenuChild', menu.id)
    },
    handlerDel (menuChild) {
      if (menuChild.id === '') {
        const index = this.menuChildList.indexOf(menuChild)
        if (index !== -1) {
          this.menuChildList.splice(index, 1)
        }
      } else {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DELETE_MENU_CHILD(menuChild.id)
            .then(() => {
              this.fetchData()
              this.$message.success('删除成功!')
            })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
    },
    fetchData () {
      const param = {
        id: this.menuId
      }
      QUERY_MENU_CHILD(param)
        .then(({ body }) => {
          this.menuChildList = body
        })
    }
  }
}
</script>

<style scoped>
.input {
  width: 220px;
}
</style>
