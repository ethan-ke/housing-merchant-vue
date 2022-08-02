<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.complex" placeholder="小区名" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="openForm">
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="小区">
        <template slot-scope="scope">
          {{ scope.row.complex }}
        </template>
      </el-table-column>
      <el-table-column label="编号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.house_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="户型" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chamber }}室{{ scope.row.hall }}厅{{ scope.row.bathroom }}卫{{ scope.row.kitchen }}厨{{ scope.row.balcony }}阳台</span>
        </template>
      </el-table-column>
      <el-table-column label="楼层" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面积" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.building_area }} m²</span>
        </template>
      </el-table-column>
      <el-table-column label="出售价格" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.selling_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="户型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.apartment_layout }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.purpose | purposeType }}
        </template>
      </el-table-column>
      <el-table-column label="朝向" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.direction | directionRowText }}
        </template>
      </el-table-column>
      <el-table-column label="装修" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.decoration | decorationType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="录入时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="{row}">
          <el-button plain size="mini" @click="editItem(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加房源"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="100px" style="width: 90%; margin-left:50px;">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房源类型">
              <el-select v-model="postForm.house_type" placeholder="请选择" class="width-percent-100">
                <el-option
                  v-for="item in house_types"
                  :key="item.value"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="看房方式" prop="checking_ways">
              <el-select v-model="postForm.checking_way" placeholder="请选择" class="width-percent-100">
                <el-option
                  v-for="item in checking_ways"
                  :key="item.value"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

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
            <el-form-item label="用途">
              <el-select v-model="postForm.purpose" placeholder="请选择" class="width-percent-100">
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
            <el-form-item label="出售价格">
              <el-col :span="11" class="padding-unset">
                <el-input v-model="postForm.min_price" placeholder="底价" />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11" class="padding-unset">
                <el-input v-model="postForm.selling_price" placeholder="售价" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="小区">
              <el-input v-model="postForm.complex" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼层">
              <el-input v-model="postForm.floor" placeholder="10/40" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门牌号">
              <el-col :span="6" class="padding-unset">
                <el-input v-model="postForm.building" placeholder="楼栋" />
              </el-col>
              <el-col class="line text-center" :span="3">-</el-col>
              <el-col :span="6" class="padding-unset">
                <el-input v-model="postForm.unit" placeholder="单元" />
              </el-col>
              <el-col class="line text-center" :span="3">-</el-col>
              <el-col :span="6" class="padding-unset">
                <el-input v-model="postForm.room" placeholder="房号" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房源编号">
              <el-input v-model="postForm.house_number" placeholder="H-10000" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="户型">
              <el-col :span="3" class="padding-unset">
                <el-input v-model="postForm.chamber" placeholder="室" />
              </el-col>
              <el-col class="line text-center" :span="1">-</el-col>
              <el-col :span="3" class="padding-unset">
                <el-input v-model="postForm.hall" placeholder="厅" />
              </el-col>
              <el-col class="line text-center" :span="1">-</el-col>
              <el-col :span="3" class="padding-unset">
                <el-input v-model="postForm.bathroom" placeholder="卫" />
              </el-col>
              <el-col class="line text-center" :span="1">-</el-col>
              <el-col :span="3" class="padding-unset">
                <el-input v-model="postForm.kitchen" placeholder="厨" />
              </el-col>
              <el-col class="line text-center" :span="1">-</el-col>
              <el-col :span="3" class="padding-unset">
                <el-input v-model="postForm.balcony" placeholder="阳台" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6"/>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="建筑面积">
              <el-input v-model="postForm.building_area" placeholder="平方米" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用面积">
              <el-input v-model="postForm.usable_area" placeholder="平方米" />
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
              <el-checkbox-group v-model="postForm.direction">
                <el-checkbox v-for="(item, index) in directions" :key="index" :label="item.type">{{ item.type | directionType }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年代">
              <el-input v-model="postForm.year" placeholder="90" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税费">
              <el-input v-model="postForm.duty" placeholder="0.00" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注">
          <el-input v-model="postForm.remark" :rows="3" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, createItem, getItem, updateItem } from '@/api/house'
const defaultPostForm = {
  id: undefined,
  phone: null,
  name: null,
  sex: 1,
  house_type: 2,
  checking_way: 1,
  purpose: 1,
  min_price: undefined,
  selling_price: undefined,
  complex: null,
  floor: null,
  building: null,
  unit: null,
  room: null,
  chamber: undefined,
  hall: undefined,
  bathroom: undefined,
  kitchen: undefined,
  balcony: undefined,
  year: undefined,
  building_area: undefined,
  usable_area: undefined,
  decoration: 2,
  direction: [],
  duty: undefined,
  house_number: null,
  remark: null
}
let that
export default {
  name: 'HousingManagementIndex',
  filters: {
    directionRowText: (array) => {
      const array_n = []
      array.map(d_item => {
        const item = that.directions.filter(item => {
          return item.type === d_item
        })
        array_n.push(item[0].name)
      })
      return array_n.join('')
    },
    decorationType: (value) => {
      const item = that.decorations.filter(item => {
        return item.type === value
      })
      return item[0].name
    },
    purposeType: (value) => {
      const item = that.options.filter(item => {
        return item.type === value
      })
      return item[0].name
    },
    directionType: (value) => {
      const item = that.directions.filter(item => {
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
        complex: undefined
      },
      rules: {
        name: [{ required: true, message: '姓名不可为空!', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不可为空!', trigger: 'blur' }]
      },
      list: null,
      listLoading: true,
      dialogVisible: false,
      house_types: [
        {
          type: 1,
          name: '二手房'
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
      checking_ways: [
        {
          type: 1,
          name: '提前预约'
        },
        {
          type: 2,
          name: '直接带看'
        },
        {
          type: 3,
          name: '借钥匙看'
        }
      ],
      options: [
        {
          type: 1,
          name: '住宅'
        },
        {
          type: 2,
          name: '别墅'
        },
        {
          type: 3,
          name: '商铺'
        },
        {
          type: 4,
          name: '仓库'
        },
        {
          type: 5,
          name: '厂房'
        },
        {
          type: 6,
          name: '土地'
        },
        {
          type: 7,
          name: '车库'
        },
        {
          type: 8,
          name: '写字楼'
        }
      ],
      directions: [
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
      getList(this.listQuery).then(response => {
        this.list = response.data.data
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
      this.fetchData()
    },
    openForm() {
      this.postForm = Object.assign({}, defaultPostForm)
      this.dialogVisible = true
    },
    submitForm() {
      if (this.postForm.id !== undefined) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            updateItem(this.postForm.id, this.postForm).then(() => {
              this.loading = true
              this.$notify({
                message: 'Success',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            createItem(this.postForm).then(() => {
              this.loading = true
              this.$notify({
                message: 'Success',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    editItem(row) {
      getItem(row.id).then(response => {
        this.postForm = response.data
        this.listLoading = false
      })
      this.dialogVisible = true
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
