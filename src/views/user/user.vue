<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList">
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button type="success" @click="addUserList = true">添加用户</el-button>
      </el-col>
      <!-- //addUserList('userform') -->
    </el-row>
    <div class="mar-t20">
      <el-table v-loading="loading" :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column width="120" label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :disabled="false" content="编辑" placement="bottom-start" effect="light">
              <el-button size="mini" icon="el-icon-edit" type="primary" plain @click="editUsers(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :disabled="false" content="删除" placement="bottom-start" effect="light">
              <el-button size="mini" icon="el-icon-delete" type="danger" plain @click="deleteUsers(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :disabled="false" content="设置用户角色" placement="bottom-start" effect="light">
              <el-button size="mini" icon="el-icon-check" type="warning" plain @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[2, 3, 4, 5]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <!-- //添加用户对话框 -->
    <el-dialog title="添加用户信息" :visible.sync="addUserList">
      <el-form :model="userform" :label-width="formLabelWidth" :rules="rules" ref="userforms">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserList = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('userforms')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- //编辑用户对话框 -->
    <el-dialog title="编辑用户信息" :visible.sync="editUserList">
      <el-form :model="editform" :label-width="formLabelWidth" :rules="rules" ref="editforms">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editform.username" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserList = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editforms')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配用户角色 -->
    <el-dialog title="分配用户角色" :visible.sync="setRoles">
      <el-form :model="Rolesform" :label-width="rolesLabelWidth">
        <el-form-item label="当前用户">
          <el-tag type="info">{{Rolesform.username}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="RoleId" placeholder="请选择角色">

            <el-option :label="role.roleName" :value="role.id" v-for="(role,index) in roles" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoles = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, changeUserStata, addUser, editUserById, editUserSubmit, deleteUserSubmit, getUserRoles, setUserRoles } from '@/api/index.js'
export default {
  data () {
    return {
      loading: true,
      value2: '',
      query: '',
      total: 0,
      pagenum: 2,
      pagesize: 2,
      userList: [],
      addUserList: false,
      editUserList: false,
      setRoles: false,
      formLabelWidth: '80px',
      rolesLabelWidth: '120px',
      userform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      RoleId: '',
      Rolesform: {},
      roles: [],
      // 添加用户的表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话不能为空' }
        ]
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    // 初始化表歌数据
    initList () {
      this.loading = true
      getUserList({params: {query: this.query, pagenum: this.pagenum, pagesize: this.pagesize}}).then(res => {
        console.log(res)
        this.userList = res.data.users
        this.total = res.data.total
      })
      this.loading = false
    },
    // 修改用户状态
    changeUserState (row) {
      console.log(row)
      changeUserStata({uid: row.id, type: row.mg_state}).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'warning'
          })
        }
      })
    },
    // 添加用户信息
    addUserSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addUser(this.userform).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'warning'
              })
            }
          })
          this.addUserList = false
          this.initList()
        }
      })
    },
    // 编辑用户信息
    editUsers (row) {
      this.editUserList = true
      editUserById(row.id).then(res => {
        this.editform.username = res.data.username
        this.editform.email = res.data.email
        this.editform.mobile = res.data.mobile
        this.editform.id = res.data.id
      })
    },
    // 编辑用户信息提交
    editUserSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editUserSubmit(this.editform).then(res => {
            console.log(res.data)
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'warning'
              })
            }
            this.editUserList = false
            this.initList()
          })
        }
      })
    },
    // 删除用户信息
    deleteUsers (row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserSubmit(row.id).then(res => {
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
    setRole (row) {
      this.setRoles = true
      console.log(row)
      this.Rolesform = row
      getUserRoles().then(res => {
        if (res.meta.status === 200) {
          this.roles = res.data
          console.log(res)
        }
      })
    },
    setRoleSubmit () {
      if (!this.RoleId) {
        this.$message({
          message: '请选择角色',
          type: 'warning'
        })
      } else {
        setUserRoles({id: this.Rolesform.id, rid: this.RoleId}).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              message: res.meta.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.meta.msg,
              type: 'warning'
            })
          }
          this.setRoles = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>
