<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <el-tabs v-model="activeName">
      <el-tab-pane label="管理员列表" name="second">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini">
            添加管理员
          </el-button>
          <div class="ml-auto d-flex">
            <el-input v-model="keyword" size="mini" style="width:200px" placeholder="请输入用户名"></el-input>
            <el-button type="info" size="mini" class="ml-2">
              搜索
            </el-button>
          </div>
        </div>
        <el-table :data="managerList" style="width: 100%" border class="mt-3">
          <el-table-column label="用户头像" align="center">
            <template slot-scope="scope">
              <el-avatar size="large" :src="scope.row.avator"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center" prop="username">
          </el-table-column>
          <el-table-column label="手机号" align="center" prop="phone">
          </el-table-column>
          <el-table-column label="邮箱" align="center" prop="email"></el-table-column>
          <el-table-column label="所属管理员" align="center">
            <template slot-scope="scope">{{ scope.row.group.name }}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色列表" name="third">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini">
            添加管理员
          </el-button>
        </div>
        <el-table :data="groupList" style="width: 100%" border class="mt-3">
          <el-table-column label="角色名称" prop="name" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">配置权限</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限列表" name="fourth">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
          :expand-on-click-node="false" draggable @node-drop="nodeDrop">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <div>
              <el-input v-if="data.editStatus" v-model="data.label" size="mini"></el-input>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      activeName: "second",
      keyword: "",
      form: {
        customer: "",
        key: ""
      },
      managerList: [{
        id: 10,
        username: "second",
        avator: "http://static.yoshop.xany6.com/2018071718294208f086786.jpg",
        phone: "18831861302",
        email: "18831861302@163.com",
        group_id: 1,
        group: {
          id: 1,
          name: "管理员"
        },
        status: 1
      }],
      groupList: [{
        id: 10,
        name: "超级管理员",
        status: 1
      }],
      data: [{
        id: 1,
        label: '一级 1',
        status: 1,
        editStatus: false,
        children: [{
          id: 2,
          label: '二级 1-1',
          status: 1,
          editStatus: false,
          children: [{
            id: 3,
            label: '三级 1-1-1',
            status: 1,
            editStatus: false,
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  filters: {
    formatType (value) {
      let arr = ['按重量', '按件数'];
      return arr[value]
    }
  },
  methods: {
    handleClick () {
    },
    handleNodeClick (data) {

    },
    showOrHide (data) {
      data.status = data.status ? 0 : 1;
    },
    // 编辑|提交
    edit (data) {
      data.editStatus = !data.editStatus;
    },
    // 删除
    remove (node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parent = node.parent;
        let children = parent.data.children || parent.data;
        let index = children.findIndex(v => {
          return v.id === data.id
        });
        children.splice(index, 1);
      }).catch(() => {
      });
    },
    // 增加
    append (data) {
      let newObj = {
        id: 2,
        label: '二级 1-1',
        status: 1,
        editStatus: true,
        children: []
      }
      data.children.push(newObj);
    },
    // 拖拽
    nodeDrop (...option) {
      console.log(option[0].data);
      console.log(option[1].data);
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