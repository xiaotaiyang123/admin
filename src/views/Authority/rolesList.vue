<template>
  <div class="roleslist">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-button type="primary" plain @click="dialogaddRoles = true">添加角色</el-button>
    <div class="mar-t20">
      <el-table :data="rolesDates" border v-loading="loading" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="first in props.row.children" :key="first.id">
              <el-col :span="3">
                <el-tag closable @close="deleteRoles(props.row,first.id)">
                  {{first.authName}}
                </el-tag>
                <i class="el-icon-arrow-right" v-if="first.children.length !== 0"></i>
              </el-col>
              <el-col :span="21">
                <el-row v-for="second in first.children" :key="second.id">
                  <el-col :span="4">
                    <el-tag type="success" closable @close="deleteRoles(props.row,second.id)">
                      {{second.authName}}
                    </el-tag>
                    <i class="el-icon-arrow-right" v-if="second.children.length !== 0"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag type="warning" closable v-for="thired in second.children" :key="thired.id" @close="deleteRoles(props.row,thired.id)"> {{thired.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="props.row.children.length === 0">
              <el-col :span="24">没有任何权限，请分配权限</el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :disabled="false" content="编辑" placement="bottom-start" effect="light">
              <el-button size="mini" icon="el-icon-edit" type="primary" plain @click="editRolesList(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :disabled="false" content="删除" placement="bottom-start" effect="light">
              <el-button size="mini" icon="el-icon-delete" type="danger" plain @click="deleteRoleList(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :disabled="false" content="授权角色" placement="bottom-start" effect="light">
              <el-button size="mini" icon="el-icon-check" type="warning" plain @click="showRight(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogaEditRoles">
      <el-form :model="editDates" :label-width="rolesLabelWidth" :rules="rules" ref="editDates">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editDates.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editDates.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaEditRoles = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit('editDates')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogaddRoles">
      <el-form :model="Rolesform" :label-width="rolesLabelWidth" :rules="rules" ref="Rolesform">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="Rolesform.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="Rolesform.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit('Rolesform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="授权角色" :visible.sync="dialogFormVisible" width="30%">
      <div class="tree-container">
        <el-tree :data="data2" ref="tree" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="selectedRights" :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGrant">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getUserRoles, deleteRolesList, getAuthList, grantRolesRight, addRoles, deleteRoles, geteditRoles, editRoles } from '@/api'

export default {
  data () {
    return {
      loading: false,
      dialogFormVisible: false,
      dialogaddRoles: false,
      dialogaEditRoles: false,
      rolesDates: [],
      rolesLabelWidth: '120px',
      Rolesform: {
        roleName: '',
        roleDesc: ''
      },
      editDates: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      data2: [],
      selectedRights: [],
      currentRole: {}, // 保存点击的角色
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      this.loading = true
      getUserRoles().then(res => {
        if (res.meta.status === 200) {
          this.rolesDates = res.data
          this.loading = false
        }
      })
    },
    deleteRoles (row, rid) {
      deleteRolesList({roleId: row.id, rightId: rid}).then(res => {
        if (res.meta.status === 200) {
          row.children = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
      })
    },
    showRight (row) {
      this.dialogFormVisible = true
      this.currentRole = row
      getAuthList({type: 'tree'}).then(res => {
        if (res.meta.status === 200) {
          this.data2 = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
      })
      this.selectedRights.length = 0
      this.currentRole.children.forEach(first => {
        if (first.children && first.children.length !== 0) {
          first.children.forEach(second => {
            if (second.children && second.children.length !== 0) {
              first.children.forEach(third => {
                this.selectedRights.push(third.id)
              })
            }
          })
        }
      })
    },
    submitGrant () {
      let rids = this.$refs.tree.getCheckedKeys().join(',')
      grantRolesRight(this.currentRole.id, {rids: rids}).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
        this.dialogFormVisible = false
        this.initList()
      })
    },
    addRoleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addRoles(this.Rolesform).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
            }
            this.dialogaddRoles = false
            this.initList()
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
    deleteRoleList (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(row).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.initList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editRolesList (row) {
      this.dialogaEditRoles = true
      geteditRoles(row).then(res => {
        this.editDates.roleName = res.data.roleName
        this.editDates.roleDesc = res.data.roleDesc
        this.editDates.id = row.id
        console.log(this.editDates)
      })
    },
    editRoleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editRoles(this.editDates).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
            }
            this.dialogaEditRoles = false
            this.initList()
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
.roleslist {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .tree-container {
    height: 300px;
    overflow: auto;
  }
}
</style>
