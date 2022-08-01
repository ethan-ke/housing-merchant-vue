<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="客户姓名" style="width: 130px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="dialogVisible = true">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加客户"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="name">
              <el-row :gutter="20" type="flex" justify="space-between" class="margin-unset">
                <el-col :span="12" class="padding-unset">
                  <el-input v-model="postForm.name" />
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="8" class="padding-unset">
                  <el-select v-model="postForm.sex" placeholder="请选择" class="width-percent-100">
                    <el-option label="先生" :value="1" />
                    <el-option label="女士" :value="2" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="postForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客源类型">
              <el-select v-model="postForm.type" placeholder="请选择" class="width-percent-100">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格范围">
              <el-col :span="11" class="padding-unset">
                <el-input v-model="postForm.min_price" />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11" class="padding-unset">
                <el-input v-model="postForm.max_price" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="需求区域">
              <el-input v-model="postForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户型">
              <el-input v-model="postForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户等级">
              <el-select v-model="postForm.customer_level" placeholder="请选择" class="width-percent-100">
                <el-option
                  v-for="item in customer_levels"
                  :key="item.value"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面积">
              <el-input v-model="postForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="需求小区">
              <el-input v-model="postForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼层">
              <el-input v-model="postForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="装修">
              <el-radio-group v-model="postForm.decoration">
                <el-radio v-for="(item, index) in decorations" :key="index" :label="item.type">{{ item.type | decorationType }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="朝向">
              <el-checkbox-group v-model="postForm.orientation">
                <el-checkbox v-for="(item, index) in orientations" :key="index" :label="item.type">{{ item.type | orientationType }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电子邮件">
              <el-input v-model="postForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="postForm.status">
                <el-radio :label="1">私客</el-radio>
                <el-radio :label="2">公客</el-radio>
                <el-radio :label="3">成交</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注">
          <el-input v-model="postForm.remark" :rows="3" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
const defaultPostForm = {
  id: undefined,
  phone: null,
  name: null,
  sex: 1,
  email: null,
  min_price: 0,
  max_price: 0,
  decoration: null,
  orientation: [],
  customer_levels: null,
  type: null,
  remark: null,
  status: 1
}
let that
export default {
  filters: {
    decorationType: (value) => {
      const item = that.decorations.filter(item => {
        return item.type === value
      })
      return item[0].name
    },
    orientationType: (value) => {
      const item = that.orientations.filter(item => {
        return item.type === value
      })
      return item[0].name
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultPostForm),
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        phone: undefined
      },
      rules: {
        name: [{ required: true, message: '姓名不可为空!', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不可为空!', trigger: 'blur' }]
      },
      list: null,
      listLoading: true,
      dialogVisible: false,
      options: [
        {
          type: 1,
          name: '买卖'
        },
        {
          type: 2,
          name: '租赁'
        },
        {
          type: 3,
          name: '新房'
        }
      ],
      customer_levels: [
        {
          type: 1,
          name: 'A类客源'
        },
        {
          type: 2,
          name: 'B类客源'
        },
        {
          type: 3,
          name: 'C类客源'
        },
        {
          type: 4,
          name: 'D类客源'
        }
      ],
      orientations: [
        {
          type: 1,
          name: '东'
        },
        {
          type: 2,
          name: '南'
        },
        {
          type: 3,
          name: '西'
        },
        {
          type: 4,
          name: '北'
        }
      ],
      decorations: [
        {
          type: 1,
          name: '毛坯'
        },
        {
          type: 2,
          name: '简装'
        },
        {
          type: 3,
          name: '精装'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  beforeCreate() {
    that = this
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style>
.filter-container {
  margin-bottom: 1rem;
}
.mr-1 {
  margin-right: 1rem;
}
</style>
