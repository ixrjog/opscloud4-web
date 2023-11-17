<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog title="Repository Compare" append-to-body :visible.sync="formStatus.visible" width="900px">
    <el-row>
      <!-- Source-->
      <el-select v-model.trim="queryParam.from" filterable style="width: 300px" placeholder="Source">
        <el-option-group v-for="group in branchOptions" :key="group.label" :label="group.label">
          <el-option v-for="item in group.options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
            <select-item :name="item.label" :comment="item.desc"/>
          </el-option>
        </el-option-group>
      </el-select>
      <span style="margin-right: 20px; margin-left: 20px">...</span>
      <!-- Target-->
      <el-input v-model="queryParam.to" :disabled="true" style="max-width: 300px">
        <template v-slot:prepend>Target</template>
      </el-input>
      <el-button @click="fetchData" style="margin-left: 5px" type="primary" plain size="mini"
                 :loading="buttons.doCompare" :disabled="queryParam.from === '' || queryParam.from === 'master'">Compare
      </el-button>
    </el-row>
    <!--Compare Results-->
    <el-row style="margin-top: 20px">
      <el-card shadow="hover" v-if="JSON.stringify(compareResults) !== '{}'">
        <div slot="header" style="height: 15px">
          <span>Commits ({{ compareResults.commits === null ? 0 : compareResults.commits.length }})</span>
        </div>
        <span v-if="compareResults.commits !== null">
             <el-card shadow="hover" style="margin-bottom: 5px" v-for="commit in compareResults.commits"
                      :key="commit.shortId ">
               <span>{{ commit.message }}</span>
               <el-tag style="float: right">{{ commit.shortId }}</el-tag>
               <br/>
               <span>{{ commit.authorName }}
                 <span style="color: rgb(100,100,100); font-size: 12px">committed {{ commit.committedDate }}</span>
               </span>
             </el-card>
        </span>
      </el-card>
    </el-row>

  </el-dialog>
</template>

<script>

// API
import {
  BRANCH_COMPARE
} from '@/api/modules/leo/leo.build.api'
import SelectItem from '@/components/opscloud/common/SelectItem'

export default {
  data () {
    return {
      editing: false,
      queryParam: {
        jobId: '',
        sshUrl: '',
        from: '',
        to: 'master'
      },
      branchOptions: [],
      buttons: {
        doCompare: false
      },
      compareResults: {}
    }
  },
  name: 'GitLabCompareComponent',
  props: ['formStatus'],
  components: {
    SelectItem
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (branch, branchOptions, getBranchOptionsParam) {
      this.compareResults = {}
      this.queryParam.from = branch
      this.branchOptions = branchOptions
      this.queryParam.jobId = getBranchOptionsParam.jobId
      this.queryParam.sshUrl = getBranchOptionsParam.sshUrl
    },
    fetchData () {
      this.buttons.doCompare = true
      BRANCH_COMPARE(this.queryParam).then(res => {
        this.compareResults = res.body
        this.buttons.doCompare = false
      }).catch((res) => {
        this.buttons.doCompare = false
        this.$message.error(res.msg)
      })
    }
  }
}

</script>

<style scoped>

.commit {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  font-size: 12px;
  margin-bottom: 5px;
}

.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
//-webkit-box-sizing: border-box; box-sizing: border-box;
}

.el-card__body {
  padding: 5px;
}

.el-input {
//display: inline-block; max-width: 300px;
}

</style>
