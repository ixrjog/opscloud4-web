<!--suppress HtmlUnknownTag -->
<template>
  <el-card shadow="hover" v-show="menuId !== ''">
    <div slot="header" style="height: 15px">
      <span>{{ title }}</span>
      <el-row style="float: right">
        <el-button @click="addMenuChild()" type="text" style="padding: 3px 0;margin-left: 5px">新增</el-button>
        <el-button @click="saveMenuChild()" type="text" style="padding: 3px 0;margin-left: 5px">保存</el-button>
      </el-row>
    </div>
    <draggable :list="menuChildList" handle=".handle">
      <div v-for="(menuChild,index) in menuChildList" :key="index">
        <el-form :inline="true" :model="menuChild" label-width="60px">
          <el-form-item style="margin-left: 20px">
            <i class="fas fa-align-justify handle" style="margin-right: 10px;"/>
          </el-form-item>
          <el-form-item required>
            <el-input v-model="menuChild.title" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item required>
            <el-input v-model="menuChild.path" class="input" placeholder="请输入路径"/>
          </el-form-item>
          <el-form-item required>
            <el-input v-model="menuChild.icon" placeholder="请输入图标">
              <i slot="suffix" :class=menuChild.icon aria-hidden="true"/>
            </el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="danger" plain size="mini" @click.prevent="handlerDel(menuChild)">
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </draggable>
  </el-card>
</template>

<script>
import draggable from 'vuedraggable'
import { DELETE_MENU_CHILD, QUERY_MENU_CHILD, SAVE_MENU_CHILD } from '@/api/modules/sys/sys.menu.api'
import ui from '@/libs/util.ui'

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
      this.menuId = menuId
      this.title = title
      this.fetchData()
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
          ui.init()
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
          DELETE_MENU_CHILD({ id: menuChild.id })
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
      QUERY_MENU_CHILD({ id: this.menuId })
        .then(({ body }) => {
          this.menuChildList = body
        })
    }
  }
}
</script>

<style scoped>
.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  //-webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.el-button {
  margin-left: 5px;
}

.input {
  width: 200px;
}
</style>
