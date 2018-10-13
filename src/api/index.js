// 所有的接口文件
import axios from 'axios'
const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

// 设置token保存登录状态
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 将token给到一个前后台约定好的key中，作为请求发送
  let token = localStorage.getItem('mytoken')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 登录验证
export const checkUser = params => {
  return axios.post('login', params).then(res => res.data)
}
// 获取用户列表
export const getUserList = params => {
  return axios.get('users', params).then(res => res.data)
}
// 更新用户状态
export const changeUserStata = params => {
  return axios.put(`users/${params.uid}/state/${params.type}`, params).then(res => res.data)
}
// r添加用户信息
export const addUser = params => {
  return axios.post('users', params).then(res => res.data)
}
// 根据ID查询用户信息
export const editUserById = params => {
  return axios.get(`users/${params}`).then(res => res.data)
}
// 编辑用户提交
export const editUserSubmit = params => {
  return axios.put(`users/${params.id}`, params).then(res => res.data)
}
// 删除用户信息
export const deleteUserSubmit = params => {
  return axios.delete(`users/${params}`).then(res => res.data)
}
// 获取用户角色列表
export const getUserRoles = params => {
  return axios.get('roles').then(res => res.data)
}
// 分配用户角色
export const setUserRoles = params => {
  return axios.put(`users/${params.id}/role`, params).then(res => res.data)
}
// 所有权限列表
export const getAuthList = params => {
  return axios.get(`rights/${params.type}`).then(res => res.data)
}
// 删除角色指定权限
export const deleteRolesList = params => {
  return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`).then(res => res.data)
}
// 角色授权
export const grantRolesRight = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, rids).then(res => res.data)
}
// 添加角色
export const addRoles = params => {
  return axios.post(`roles`, params).then(res => res.data)
}
// 删除角色
export const deleteRoles = params => {
  return axios.delete(`roles/${params.id}`).then(res => res.data)
}
// 根据ID查询用户信息
export const geteditRoles = params => {
  return axios.get(`roles/${params.id}`).then(res => res.data)
}
// 编辑提交角色
export const editRoles = params => {
  return axios.put(`roles/${params.id}`, params).then(res => res.data)
}
// 编辑提交角色
export const getMenus = () => {
  return axios.get(`menus`).then(res => res.data)
}
// 商品数据列表
export const getcategories = params => {
  return axios.get(`categories`, { params: params }).then(res => res.data)
}
// 添加分类
export const addcategories = params => {
  return axios.post(`categories`, params).then(res => res.data)
}
// s删除分类
export const deletecategories = params => {
  return axios.delete(`categories/${params}`).then(res => res.data)
}
// 根据id查询分类
export const querycategories = params => {
  return axios.get(`categories/${params}`).then(res => res.data)
}
// 根据id查询分类
export const submitcategories = params => {
  return axios.put(`categories/${params.id}`, params).then(res => res.data)
}
