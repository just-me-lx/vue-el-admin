<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <div class="py-2 border-bottom d-flex align-items-center">
      <el-button type="primary" size="mini" @click="createTop">
        创建顶级分类
      </el-button>
    </div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
      :expand-on-click-node="false" draggable @node-drop="nodeDrop" @node-drag-end="nodeDropEnd">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <div>
          <el-input v-if="data.editStatus" v-model="data.name" size="mini"></el-input>
          <span v-else>{{ node.label }}</span>
        </div>

        <span>
          <el-button :type="data.status ? 'primary' : 'danger'" size="mini" @click.stop="showOrHide(data)" plain>
            {{ data.status ? "显示" : "隐藏" }}
          </el-button>
          <el-button type="danger" size="mini" @click="append(data)" plain>
            增加
          </el-button>
          <el-button :type="data.editStatus ? 'default' : 'warning'" size="mini" @click="edit(data)" plain>
            {{ data.editStatus ? "完成" : "修改" }}
          </el-button>
          <el-button type="success" size="mini" @click="remove(node, data)" plain>
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  inject: ['layout'],
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  created () {
    this.__init()
  },
  computed: {
    // 排序后的数据
    sortData () {
      let data = []
      let sort = function (arr) {
        arr.forEach(item => {
          data.push(item)
          if (item.child.length) {
            sort(item.child)
          }
        })
      }
      // 多维数组转一维数组
      sort(this.data)
      // 排序
      data = data.map((item, index) => {
        return {
          id: item.id,
          order: index,
          category_id: item.category_id
        }
      })
      return data
    }
  },
  methods: {
    __init () {
      this.layout.showLoading()
      this.axios.get('/admin/category', {
        token: true
      }).then(res => {
        let data = res.data.data
        let addEditStatus = function (arr) {
          arr.forEach(item => {
            item.editStatus = false
            if (item.child.length) {
              addEditStatus(item.child)
            }
          });
        }
        addEditStatus(data)
        this.data = data
        this.layout.hideLoading()
      }).catch(err => {
        this.layout.hideLoading()
      })
    },
    handleNodeClick (data) {

    },
    showOrHide (data) {
      this.layout.showLoading()
      let status = data.status ? 0 : 1;
      let msg = status ? '显示' : '隐藏'
      this.axios.post('/admin/category/' + data.id + '/update_status', {
        status: status
      }, {
        token: true
      }).then(res => {
        data.status = status
        this.layout.hideLoading()
        this.$message({
          message: msg + '成功',
          type: 'success'
        })
      }).catch(err => {
        this.layout.hideLoading()
      })
    },
    // 编辑|提交
    edit (data) {
      console.log(data)
      if (!data.editStatus) {
        return data.editStatus = true
      }
      if (data.name == "") {
        return this.$message({
          message: '分类名称不能为空',
          type: 'error'
        })
      }
      this.layout.showLoading()
      this.axios.post('/admin/category/' + data.id, {
        status: data.status,
        name: data.name,
        category_id: data.category_id
      }, { token: true }).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        data.editStatus = false
        this.layout.hideLoading()
      }).catch(err => {
        this.layout.hideLoading()

      })
    },
    // 删除
    remove (node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.layout.showLoading()
        this.axios.delete('/admin/category/' + data.id, {
          token: true
        }).then(res => {
          this.__init()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.layout.hideLoading()
        }).catch(err => {
          this.layout.hideLoading()
        })
      }).catch(() => {
      });
    },
    // 增加
    append (data) {
      this.layout.showLoading()
      this.axios.post('/admin/category', {
        status: 0,
        name: '新分类',
        category_id: data.id
      }, {
        token: true
      }).then(res => {
        let obj = res.data.data
        obj.editStatus = true
        obj.child = []
        data.child.push(obj)
        this.layout.hideLoading()
      }).catch(err => {
        this.layout.hideLoading()

      })
    },
    // 拖拽结束时触发的事件
    nodeDropEnd (...options) {
      // 被拖拽节点对应的数据
      let item = options[0].data
      // 结束拖拽时最后进入的节点数据
      let obj = options[1].data
      if (obj) {
        if (options[2] === 'before' && options[2] === 'after') {
          item.category_id = obj.category_id
        } else {
          item.category_id = obj.id
        }
      }
    },
    // 拖拽
    nodeDrop (...option) {
      this.layout.showLoading()
      this.axios.post('/admin/category/sort', {
        sortdata: JSON.stringify(this.sortData)
      }, { token: true }).then(res => {
        this.__init()
        this.layout.hideLoading()
      }).catch(err => {
        this.layout.hideLoading()
      })
    },
    // 创建顶级分类
    createTop () {
      this.$prompt('请输入顶级分类名称', '提示', {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputValidator: function (val) {
          if (val === "" || val === null) {
            return "顶级分类名称不能为空"
          }
          return true;
        }
      }).then(({ value }) => {
        this.layout.showLoading()
        this.axios.post('/admin/category', {
          status: false,
          category_id: 0,
          name: value
        }, { token: true }).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.__init()
          this.layout.hideLoading()
        }).catch(err => {
          this.layout.hideLoading()

        })

      }).catch(() => {
      });
    }
  }
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  padding: 20px 0px;
}
</style>