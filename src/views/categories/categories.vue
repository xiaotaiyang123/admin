<template>
  <div class="categories">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="success" @click="addCate">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="mar-t20">
      <tree-grid :treeStructure="true" :columns="columns" :data-source="dataSource" @deleteCate="deleteCategory" @editCate="editCategory">
      </tree-grid>
    </div>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[2, 3, 4, 5]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <!--添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addCateList">
      <el-form :model="catefrom" :label-width="formLabelWidth" :rules="rules" ref="catefroms">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="catefrom.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader expand-trigger="hover" :options="options" :props="props" v-model="selectedOptions" @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateList = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit('catefroms')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改分类 -->
    <el-dialog title="修改分类" :visible.sync="editCateList">
      <el-form :model="cateEditFrom" :label-width="formLabelWidth" :rules="rules" ref="cateEditFroms">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateEditFrom.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader expand-trigger="hover" :options="options" :props="props" v-model="selectedOptions" @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCateList = false">取 消</el-button>
        <el-button type="primary" @click="editCateSubmit('cateEditFroms')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import treeGrid from '@/components/TreeGrid/TreeGrid.vue'
import { getcategories, addcategories, deletecategories, querycategories, submitcategories } from '@/api'
export default {
  data () {
    return {
      catefrom: {
      },
      cateEditFrom: {},
      editCateList: false,
      formLabelWidth: '80px',
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      selectedOptions: [],
      addCateList: false,
      dataSource: [],
      total: 0,
      pagenum: 1,
      pagesize: 2,
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }],
      rules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    treeGrid
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      getcategories({ type: 3, pagesize: this.pagesize, pagenum: this.pagenum }).then(res => {
        if (res.meta.status === 200) {
          this.dataSource = res.data.result
          this.total = res.data.total
        }
      })
    },
    deleteCategory (cid) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletecategories(cid).then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.$message({
              message: res.meta.msg,
              type: 'success'
            })
          }
          this.initList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editCategory (cid) {
      this.editCateList = true
      querycategories(cid).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.cateEditFrom = res.data
        }
      })
    },
    editCateSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          submitcategories({id:formName.id, cat_name:formName.cat_name}).then(res => {
            console.log(res)
          })
        } else {
          this.$message({
            type: 'error',
            message: '请输入内容'
          })
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initList()
    },
    handleChange (value) {
      console.log(value)
    },
    addCate () {
      this.addCateList = true
      getcategories({type: 2}).then(res => {
        if (res.meta.status === 200) {
          this.options = res.data
        }
      })
    },
    addCateSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.selectedOptions.length === 0) {
            this.catefrom.cat_pid = 0
            this.catefrom.cat_level = 0
          } else if (this.selectedOptions.length === 1) {
            this.catefrom.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
            this.catefrom.cat_level = 1
          } else if (this.selectedOptions.length === 2) {
            this.catefrom.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
            this.catefrom.cat_level = 2
          }
          addcategories(this.catefrom).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
              this.addCateList = false
              this.initList()
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请输入内容'
          })
          return false
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.categories {
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>
